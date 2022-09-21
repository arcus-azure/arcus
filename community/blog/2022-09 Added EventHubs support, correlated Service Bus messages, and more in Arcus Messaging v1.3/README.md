# Added EventHubs supported, correlated Service Bus messages, and more in Arcus Messaging v1.3
Arcus Messaging v1.3 is a big release with big changes. Full of features, extended functionality, and useful helpers. This post goes over the major parts of this release.

## EventHubs message handling support
Arcus Messaging v1.3 introduces a new type of messaging to the family: EventHubs messaging. Previously, we only supported Azure Service Bus messaging in both message pump worker and Azure Functions trigger scenarios. EventHubs support was a long awaited feature and received more priority due to our internal community. This shows that Arcus is driven by community work and not by higher-up ideas.

Because of our very flexible messaging framework, we were able to quickly and easily add EventHubs messaging. A message pump implementation is available in the `Arcus.Messaging.Pumps.EventHubs` package and a message router implementation (for non-message pump scenarios, like Azure Functions) is available in the `Arcus.Messaging.Abstractions.EventHubs` package.

You can create your own EventHubs message handler implementation by implementing the `IAzureEventHubsMessageHandler<>` interface. This process is very similar to Service Bus. The only difference here is the use of a specific message context `AzureEventHubsMessageContext` which gives consumers access to the EventHubs-specific information. This includes the EventHubs namespace, consumer group but also message-specific information like the partition key. This info is useful for message tracking during message processing.

The following example shows how a sensor reading can be processed from a message handler implementation.
```csharp
using Arcus.Messaging.Abstractions.EventHubs.MessageHandling;
using Microsoft.Extensions.Logging;

public class SensorReadingAzureEventHubsMessageHandler : IAzureEventHubsMessageHandler<SensorReading>
{
    private readonly ILogger _logger;

    public SensorReadingAzureEventHubsMessageHandler(ILogger<SensorReadingAzureEventHubsMessageHandler> logger)
    {
        _logger = logger;
    }

    public async Task ProcessMessageAsync(
        SensorReading reading,
        AzureEventHubsMessageContext messageContext,
        MessageCorrelationInfo correlationInfo,
        CancellationToken cancellation)
    {
        _logger.LogInformation("Process sensor reading {SensorId} (Type: {SensorType})", reading.SensorId, reading.SensorType);

        // Process sensor reading...
    }
}
```

Registering this implementation is also very similar to Service Bus. We provide an `.AddEventHubsMessagePump(...)` extension to register a message pump implementation that retrieves events from EventHubs without any additional action on your part. The consumers' job is only focusing on how events, or in this case sensor reading events, should be processed.
```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

Host.CreateDefaultBuilder()
    .ConfigureSecretStore(...)
    .ConfigureServices(services =>
    {
        services.AddEventHubsMessagePump("<event-hubs-name>", "<event-hubs-connection-string-secret-name>", "<blob-container-name>", "<storage-account-connection-string-secret-name>")
                .WithEventHubsMessageHandler<SensorReadingAzureEventHubsMessageHandler, SensorReading>();
    });
```

⚠ Note that the EventHubs connection string and storage account connection string are not passed along directly to the message pump extension, but that a secret name is provided. This secret name should correspond with a stored secret in the Arcus secret store. For more information on the secret store, see [our official documentation](https://security.arcus-azure.net/features/secret-store).

💡 The EventHubs message pump and message router have a lot more options to modify the message handling to your needs. See [our official documentation](https://messaging.arcus-azure.net/Features/message-handling/event-hubs) for more information on this and other topics.

## Correlated Service Bus and EventHubs messages
Service-to-service correlation is a big focus within Arcus. We have already updated our Web API package to fully support send/receive operations of correlated HTTP requests/responses. This results in a clear overview of all the interactions between multiple components in Application Insights. The same correlation functionality is now added to the Messaging library, making almost all our components correlation-ready.

Retrieving and processing messages via message pumps or message routers automatically results in request telemetry in Application Insights, so no consumer action is required here. Placing messages on Service Bus or an EventHubs queue requires you to use one of our extensions on `ServiceBusSender` or `EventHubsProducerClient` respectively. Usually, when interacting with Azure in this way, you would register these clients into your application so they can be injected, reused and tested easily. [Azure SDK clients](https://www.nuget.org/packages/Microsoft.Extensions.Azure/) is a great way to do this.
```csharp
using Microsoft.Extensions.Hosing;

Host.CreateDefaultBuilder()
    .ConfigureServices(services =>
    {
        services.AddAzureClients(clients =>
        {
            clients.AddServiceBusClientWithNamespace("<fully-qualified-servicebus-namespace>")
                   .WithName("Order Worker")
                   .WithCredential(new ManagedIdentityCredential());
        });
    });
```

Registering your clients this way provides you with an `IAzureClientFactory<>` implementation from which you can create a `ServiceBusSender` or `EventHubsProducerClient` instance. This example shows that with one of the provided `SendAsync` extensions, you can pass along your application correlation so that the send-out message will be correlated. This works great together with our message pumps/routers.
```csharp
using Arcus.Observability.Correlation;
using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Logging;

[ApiController]
public class OrderController : ControllerBase
{
    private readonly ServiceBusSender _serviceBusSender;
    private readonly IHttpCorrelationInfoAccessor _correlationAccessor;
    private readonly ILogger _logger;

    public OrderController(
        IAzureClientFactory<ServiceBusSender> clientFactory,
        IHttpCorrelationInfoAccessor correlationAccessor,
        ILogger<OrderController> logger)
    {
        _serviceBusSender = clientFactory.CreateClient("Order Worker");
        _correlationAccessor = correlationAccessor;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> PostOrder([FromBody] Order order)
    {
        CorrelationInfo correlation = _correlationAccessor.GetCorrelationInfo();
        await _serviceBusSender.SendAsync(order, correlation, _logger);
    }
}
```

⚡ We have similar functionality for EventHubs where we provide `SendAsync` extensions on the `EventHubsProducerClient`.

For more information see our official documentation for [Service Bus extensions](https://messaging.arcus-azure.net/Features/service-bus-extensions) and [EventHubs extensions](https://messaging.arcus-azure.net/Features/event-hubs-extensions).

💡 We have a [user guide](https://observability.arcus-azure.net/Guidance/Service-to-service%20Correlation/use-service-to-service-correlation-in-service-bus) that explains fully how service-to-service correlations work for applications that integrate Service Bus. 

## Removed exception details from TCP health probe
We also added a small feature with a big security impact to this release. The v0.8 Arcus Templates release included a dedicated API health report model with the exception details removed. These details are useful for defect localization but are unnecessary information for the public eye. In certain cases, this information could be used maliciously and pose a security risk.

The Arcus Messaging also has a variant on this health report endpoint, which is our TCP health probe that exposes the health of an application via a configurable TCP endpoint. This was using Microsoft's default health report, which included exception details.

Starting from Arcus Messaging v1.3, these exception details are removed from the public endpoint which makes it a more safe and production-ready implementation.

## Conclusion
Arcus Messaging v1.3 is a big release with support for EventHubs but also provides extensive functionality to fully support service-to-service scenarios.
Have a look at our [release notes](https://github.com/arcus-azure/arcus.messaging/releases/tag/v1.3.0) and [official documentation](https://messaging.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.messaging/issues/new/choose).
Thanks for reading!

The Arcus team
