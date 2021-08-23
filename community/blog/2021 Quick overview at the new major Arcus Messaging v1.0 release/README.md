# Taking messaging to the next level with Arcus Messaging v1.0
Arcus Messaging v1.0 release is the biggest one yet which provides more ways to authenticate, improvements, and many more.

Because the new version contains a few breaking changes, we provide a [dedicated migration guide](https://messaging.arcus-azure.net/guides/migration-guide-v1.0) to help end-users to migrate to our new approach.

Come and take a quick look what the release has to offer in this overview blog post.

## New Azure SDK
Microsoft released a [new client library SDK](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/README.md) for interacting with Azure Service Bus resources. This new library is part of the overall Azure SDK updates.

We believe we need to align with this new strategy, so we have adopted it in [Arcus Security](https://github.com/arcus-azure/arcus.security) and now it was time to align Arcus Messaging.

The most notable change here for consumers is the move from the Azure Service Bus `Message` model towards the `ServiceBusReceivedMessage`. This breaking change has the most impact on our fallback message handlers, which receive the full Azure Service Bus message in their implementation.

An example of this new signature:

```csharp
using Arcus.Message.Abstractions.ServiceBus.MessageHandling;
using Azure.Messaging.ServiceBus;

public class OrderFallbackMessageHandler : IAzureServiceBusFallbackMessageHandler
{
    private readonly ILogger _logger;

    public OrderFallbackMessageHandler(ILogger<OrderFallbackMessageHandler> logger)
    {
        _logger = logger;
    }

    public Task ProcessMessageAsync(
        ServiceBusReceivedMessage message,
        AzureServiceBusMessageContext messageContext,
        MessageCorrelationInfo messageCorrelationInfo,
        CancellationToken cancellactionToken)
    {
        _logger.LogInformation("Start processing Azure Service Bus message {MessageId}...", message.MessageId);
    }
}
```

Microsoft has also provided a [dedicated migration guide](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md) for this new Azure SDK if you're curious in any new funtionality or changes.

## Extracted message routing for multi-purpose message handling
Versions before the v1.0 release all used the message pump to both receive and route the messages to the correct registered message handler. In this release, we have made sure that these two resposibilities are split between two services. The message pump still receives the messages, but now a dedicated router will determine and delegate the message to the message handler that can handle the message.

We made this change because it allows us to re-use this routing functionality for other purposes. Our ultimate goal is to use this router in Azure Functions where the function trigger takes on the role of the message pump and our message router can be called directly from the function trigger implementation. This would become highly reusable as the exact same message handlers could be used for both approaches: via message pump and via Azure Functions. Currently, the message router cannot be used in Azure Functions (at the time of writing) as we are depending on a [preview package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus/5.0.0-beta.5).

To get you exicted, such Azure Functions implementation would look something like this:

```csharp
using Arcus.Messaging.Abstractions;
using Arcus.Messaging.Abstractions.ServiceBus;
using Arcus.Messaging.Abstractions.ServiceBus.MessageHandling;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

public class OrderProcessingFunction
{
    private readonly IAzureServiceBusMessageRouter _messageRouter;
    private readonly string _jobId;

    public OrderProcessingFunction(IAzureServiceBusMessageRouter messageRouter)
    {
        _messageRouter = messageRouter;
        _jobId = Guid.NewGuid().ToString();
    }

    [FunctionName("order-processing")]
    public async Task Run(
        [ServiceBusTrigger("docker-az-func-queue", Connection = "ARCUS_SERVICEBUS_CONNECTIONSTRING")] ServiceBusReceivedMessage message,
        ILogger log,
        CancellationToken cancellationToken)
    {
        log.LogInformation($"C# ServiceBus queue trigger function processed message: {message.MessageId}");

        AzureServiceBusMessageContext context = message.GetMessageContext(_jobId);
        MessageCorrelationInfo correlationInfo = message.GetCorrelationInfo();

        await _messageRouter.RouteMessageAsync(message, context, correlationInfo, cancellationToken);
    }
}
```

## Managed identity authentication
This new version also has a new way of authenticating the Azure Service Bus message pump. We've added managed identity authentication in both Azure Service Bus queues as topics. 
This authentication mechanism uses the new Azure SDK, explained in a previous section. 

Managed identity authentication allows us to use zero(!) secrets and fully relies on the automatically assigned identity to authenticate with any Azure service.
For more information, see the [offical Microsoft documentation](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview#how-a-user-assigned-managed-identity-works-with-an-azure-vm).

```csharp
using Microsoft.Extensions.DependencyInjection;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Uses managed identity to authenticate with the Azure Service Bus Queue:
        services.AddServiceBusQueueMessagePumpUsingManagedIdentity(
            queueName: "orders",
            serviceBusNamespace: "<your-namespace>"
            // The optional client id to authenticate for a user assigned managed identity.
            clientId: "<your-client-id>");

        // Uses managed identity to authenticate with the Azure Service Bus Topic:
        services.AddServiceBusTopicMessagePumpUsingManagedIdentity(
            topicName: properties.EntityPath,
            subscriptionName: "Receive-All", 
	          serviceBusNamespace: "<your-namespace>"
            // The optional client id to authenticate for a user assigned managed identity.
            clientId: "<your-client-id>");
    }
}
```

## Flexible message parsing
Our built-in JSON deserialization is using by-default a very strict schema when parsing incoming messages. Only when all the properties in the JSON body matched the properties in the typed message of the message handler, would the message be processed. This allows a very secure system as you know that you're processing the correct type of message. But in development scenario's where you update the messaging model and forget to update the message type, this can become cumbersome as you would end up with lots of errors saying that the message handler can't process your message.

In the following example, the `.Deserialization.AdditionalMembers` property is set to `Ignore`, which means any additional members that are in the incoming messaging model but are not in the `Order` message type will be ignored instead of errrored (default).

```csharp
using Microsoft.Extensions.DependencyInjection;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddServiceBusTopicMessagePump(
          "<your-servicebus-topic-name>", 
          "<your-servicebus-namespace-connection-string>", 
          options => options.Deserialization.AdditionalMembers = AdditionalMembersHandling.Ignore)
                .WithServiceBusMessageHandler<OrderMessageHandler, Order>();
    }
}
```

## Conclusion
The major v1.0 Arcus Messaging release was a big update in the library. Lots of changes and improvements were made so it becomes even more production-ready.
Have a look at our [release notes](https://github.com/arcus-azure/arcus.messaging/releases/tag/v1.0.0) and [official documentation](https://messaging.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.messaging/issues/new/choose).
Thanks for reading!

The Arcus team
