# Arcus Templates v1.0: a major release with major features
The Arcus Templates library is less prone to breaking changes as it does not provide code but starter projects. Because of this, major releases could be unnecessarily postponed. We decided to release Arcus Templates v1.0 as the number of features and changes is far too great for a minor release. Come see it for yourself in this run-down post of the release's highlights.

## Introducing isolated Azure Functions
Isolated Azure Functions is an alternative way for in-process Azure Functions. It runs the implementation as a separate process - hence, the name 'isolated'. This provides many benefits to the consumer. One of which is more control over the hosting capabilities of the function. For more information on the difference between the two, see [Microsoft's documentation](https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide).

This release introduces a project option to configure the functions worker of our Azure Functions project templates. Both in-process and isolated are supported; until Microsoft decides to stop supporting the former. Currently, only the Azure Functions Service Bus topic project template (and the new EventHubs project template) are having this option but rest assured, soon the remaining templates will follow suit.

The biggest difference in isolated projects is that the project will have a `Program` instead of a `Startup` file. The Azure Functions project acts like a regular .NET worker project, in this way. Different from the worker templates is that Arcus only registers the message router because the Azure Function is the message pump for the Service Bus message. Here is a snippet from the `Program` file that shows how we can make use of the `ConfigureFunctionsWorkerDefaults` extension to register all the necessary messaging functionality.
```csharp
using Arcus.Security.Core.Caching.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

private static IHostBuilder CreateHostBuilder(string[] args)
{
    return Host.CreateDefaultBuilder(args)
               .ConfigureFunctionsWorkerDefaults((context, builder) =>
               {
                   builder.Services.AddServiceBusMessageRouting()
                                   .WithServiceBusMessageHandler<OrdersAzureServiceBusMessageHandler, Order>();
               })
               .ConfigureSecretStore((config, stores) =>
               {
#if DEBUG
                   stores.AddConfiguration(config);
#endif
                   stores.AddAzureKeyVaultWithManagedIdentity("https://your-keyvault.vault.azure.net/", CacheConfiguration.Default);
               });
}
```

The project will still have an `OrderFunction` file that receives Azure Service Bus messages from the topic subscription. The difference here is that [Microsoft doesn't yet support all Service Bus message metadata](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=isolated-process%2Cextensionv5&pivots=programming-language-csharp) so we had to be creative to retrieve this. But, no worries, the project has all the necessary functionality to fully support Arcus Messaging. Your focus can remain on the implementation of your message handlers.
For more information on the Azure Functions Service Bus trigger project template, see our [official documentation](https://templates.arcus-azure.net/features/azurefunctions-servicebus-topic-template).

## Adding Azure EventHubs project templates
One of the requested features during an internal Arcus survey was to include EventHubs messaging support. Arcus Messaging v1.3 made this possible, but unlike Service Bus messaging there was not yet any kind of project template that included this type of messaging. Arcus Templates v1.0 comes both with an EventHubs .NET worker template and an Azure Functions EventHubs trigger template (which supports isolated and in-process).

Project templates are a great way to experiment and play with Arcus functionality. They are living code samples that are updated constantly to support the latest features.
EventHubs messaging is no exception.

We included in these new project templates a useful example of EventHubs messaging. Instead of using `Order` messages like the Service Bus project templates, we opt to create a sample message handler that received sensor readings.
```csharp
using Arcus.Messaging.Abstractions;
using Arcus.Messaging.Abstractions.EventHubs;
using Arcus.Messaging.Abstractions.EventHubs.MessageHandling;
using Microsoft.Extensions.Logging;

public class SensorReadingAzureEventHubsMessageHandler : IAzureEventHubsMessageHandler<SensorReading>
{
    private readonly ILogger<SensorReadingAzureEventHubsMessageHandler> _logger;

    public SensorReadingAzureEventHubsMessageHandler(ILogger<SensorReadingAzureEventHubsMessageHandler> logger)
    {
        _logger = logger;
    }

public Task ProcessMessageAsync(
    SensorReading message,
    AzureEventHubsMessageContext messageContext,
    MessageCorrelationInfo correlationInfo,
    CancellationToken cancellationToken)
    {
        _logger.LogInformation("Sensor reading processed!");

        return Task.CompletedTask;
    }
}
```

Apart from this, the project's contents are very similar - if not identical: we use the Arcus Messaging EventHubs message pump in the .NET Worker project template and solely register the EventHubs message router in the Azure Functions variant. The message handler, too, is an exact copy in both templates which only shows the re-usability of Arcus Messaging.
For more information on both templates, see our official documentation:
- [Arcus EventHubs worker project template](https://templates.arcus-azure.net/features/eventhubs-worker-template)
- [Azure Functions EventHubs trigger project template](https://templates.arcus-azure.net/features/azurefunctions-eventhubs-template)

## Finalizing Web API project template
The Arcus Web API project template is the oldest and probably the most popular template in our library. It has been used in several projects and has been improved with feedback to strengthen it for real-life scenarios. The Arcus Templates v1.0 release does not include groundbreaking changes but does however include two small interventions that increase usability.

### Default HTTP port
People are often eager to begin. Creating a project from a template energizes them. 'All the boilerplate code is already written!' The logical consequence is that people want to start the project as soon as possible, seeing how everything works together. The problem with the template before this release was that it did not contain a default HTTP port, so it could not be started out-of-the box. This port is usually not hard-coded and configured, but during development, it is nice to not have to worry about this thingy thing. That is why we added a default HTTP port that makes the project run directly after creation.

### Auto-start Swagger
The resulting project is now not only able to start directly, but it also automatically navigates toward the Swagger UI page (if OpenAPI is not excluded via the project options). You can immediately see the available API endpoints that the project provides. This also helps development greatly.

## Conclusion
The Arcus Templates v1.0 release is the biggest one in this library. It contains new project templates, adds project options and improves the overall workings of the resulting functionality, guided by users' feedback. This blog post only goes over the major changes but it does not by far encapsulates everything. See our  [v1.0 release notes](https://github.com/arcus-azure/arcus.templates/releases/tag/v1.0.0) to learn more about this major release and our [official documentation](https://templates.arcus-azure.net/) for more information on all the provided project templates in this library.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.templates/issues/new/choose).

Thanks for reading!
-Arcus team