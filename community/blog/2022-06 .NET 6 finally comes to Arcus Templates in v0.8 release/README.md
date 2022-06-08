# .NET 6 finally comes to Arcus Templates in v0.8 release, together with new templates and features
The v0.8 release of Arcus Templates ends the journey of adding .NET support to Arcus. This release also contains tons of new features and useful changes. This run-down post will guide you through the biggest ones.

## New Azure Functions Service Bus message handling project templates
The core functionality of the Arcus Messaging library is message handling. Describing the business logic in reusable message handlers where an incoming message is routed via Arcus functionality to the correct handler. Previous releases of Arcus Messaging made sure that the functionality that receives a message is separated from the functionality that routes the message. The reason for this is so we can reuse the message routing in different scenarios. This is one of those scenarios.

Azure Functions differ from the usual message pump setup because the message is already being received by the function's trigger; whether it is a message on an Azure Service Bus queue or a topic subscription. Since the trigger already takes over the work of the message pump, we only need to route messages.

Easy extensions on the Azure Functions types allow you to register your message handlers the same way as with a message pump setup. 

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

[assembly: FunctionsStartup(typeof(Startup))]

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.ConfigureSecretStore(...);

        builder.AddServiceBusMessageRouting()
               .WithServiceBusMessageHandler<OrdersAzureServiceBusMessageHandler, Order>();
    }
}
```

In Azure Service Bus scenarios, a descriptive `IAzureServiceBusMessageRouter` implementation can be injected into your function which gives you access to the message routing and by extension your registered message handlers.

```csharp
using Arcus.Messaging.Abstractions;
using Arcus.Messaging.Abstractions.ServiceBus;
using Arcus.Messaging.Abstractions.ServiceBus.MessageHandling;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

public class OrderFunction
{
    private readonly IAzureServiceBusMessageRouter _messageRouter;
    private readonly string _jobId;

    public OrderFunction(IAzureServiceBusMessageRouter messageRouter)
    {
        _messageRouter = messageRouter;
        _jobId = Guid.NewGuid().ToString();
    }

    [FunctionName("order-processing")]
    public async Task Run(
        [ServiceBusTrigger("orders", Connection = "ServiceBusConnectionString")] ServiceBusReceivedMessage message,
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

The code described here is an exact implementation of what is available in the new Arcus Azure Functions Service Bus project templates. We have one for both [Azure Service Bus queue](https://templates.arcus-azure.net/features/azurefunctions-servicebus-queue-template) and [Azure Service Bus topic subscription](https://templates.arcus-azure.net/features/azurefunctions-servicebus-topic-template).

## Remove exception details from health report in Web API project template
The OpenAPI documentation is by default available in the Web API project template (but can be excluded if needed). Adding the OpenAPI documentation to your API also means that the API models used during request/response will be externalized in the OpenAPI endpoint JSON. It was by inspecting this OpenAPI documentation that we saw a problem with the default application health endpoint that is available in the Web API project template. This endpoint used Microsoft's `HealthReport` model which can include exception details when the application is unhealthy. Generating the OpenAPI document caused failures because the exception details could contain possible internal type information which resulted in an enormous amount of types that needed to be included in the document. Also from a security perspective, this is not a good approach because it leaks information about the internal system. It could even leak application types that aren't used in the API.

We solved this problem by adding a custom API model to the template. This custom model is an exact copy of Microsoft's `HealthReport` except that it doesn't contain any exception details. It still has a description, data, and tags to inform the user why the application is healthy or not, but it doesn't burden the recipient with internal information.

The health endpoint available in the Web API project template uses this new API model as a way to expose the application's health. For more information on the Web API project template, see [our official documentation](https://templates.arcus-azure.net/features/web-api-template).

## Hide JSON serialization behind maintainable extensions
The Arcus templates are especially useful for speeding up development and removing the need to write boilerplate code. Message handling, secret management, we have all sorts of ways to abstract a problem into business components. Sometimes, though, it is not such a big piece of boilerplate functionality. The Web API project template used to have some lines of code to restrict and configure the JSON serialization. It was not a lot but it was enough to make the application startup code dirty. Not only dirty; but less maintainable. The code was removing output formatters, changing how the JSON serialization handles enumerations, etc. If we would decide to change this strategy, we couldn't provide support to consumers who already ran the template in their project.

A previous Web API release made sure that our JSON serialization strategy is accessible through the MVC options, which makes it not only cleaner but also more maintainable.

```csharp
WebApplicationBuilder builder = ...

builder.Services.AddControllers(options =>
{
    options.OnlyAllowJsonFormatting();
    options.ConfigureJsonFormatting(json =>
    {
        json.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        json.Converters.Add(new JsonStringEnumConverter());
    });
});
```

The code sample is the actual result of how the Web API project template now handles JSON serialization. As you can see, it is a much cleaner and safer approach.
For more information on the Web API project template, see [our official documentation](https://templates.arcus-azure.net/features/web-api-template).

## .NET 6 support
The v0.8 Templates ends the quite long journey of adding .NET 6 support to Arcus. All the dependent libraries were already targeting both .NET Core and .NET 6, but now the template projects are also fully .NET 6 compatible. Unlike the libraries, the templates don't require multi-target support so the .NET 6 features can be used freely.

We've learned a lot during adding this kind of widespread support to Arcus and plan to use that knowledge in the future when .NET 7 arrives.

## Conclusion
The Templates v0.8 release was a much-requested release. It took us quite some time to fully make these project templates not only .NET 6 compatible, but also using the latest features and Arcus changes from dependent libraries. Now, these templates are finally done and can be used in your next project.

See [our official documentation](https://templates.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.templates/issues/new/choose).

Thanks for reading!
-Arcus team