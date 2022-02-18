# Service correlation preparation and .NET 6 support in Arcus Observability v2.4
Some time has passed since our last release of Arcus Observability. Recently, we finished the v2.4 release which has tons of new features. Let's take a look!

We are preparing for a major feature called [service-to-service correlation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-map?tabs=net). This feature will allow us to correlate back-and-forth between different services, linking your entire application. This is a great way to get an solid overview of your project, and pin-point possible problems like bottlenecks.
Because this feature encompasses several different systems and type of services, we are preparing each related Arcus repository. Starting with [Arcus Observability](https://github.com/arcus-azure/arcus.observability).

## Tracking Azure Service Bus requests
Before v2.4, we could only track HTTP requests. Which meant that we only could track incoming messages in an Web API context. For our service-to-service correlation feature, this was not enough as many different services can 'receive' a request. Azure Service Bus, for example.

In Arcus Observability v2.4, we've added support for tracking incoming messages on Azure Service Bus queues or topic subscriptions. In an application, when a message is peaked on the queue or topic subscription, one can now track this message. In a larger setup, this was a small but critical missing part of the service-to-service correlation puzzle.

```csharp
using Microsoft.Extensions.Logging;

bool isSuccessful = false;

// Start measuring.
using (var measurement = DurationMeasurement.Start())
{
    try
    {
        // Processing message.

        // End processing.
        
        isSuccessful = true;
    }
    finally
    {
        logger.LogServiceBusQueueRequest("<my-queue-namespace>.servicebus.windows.net", "<my-queue-name>", "<operation-name>", isSuccessful, measurement);
        // Output: Azure Service Bus from <operation-name> completed in 0.00:12:20.8290760 at 2021-10-26T05:36:03.6067975 +02:00 - (IsSuccessful: True, Context: {[ServiceBus-Endpoint, <my-queue-namespace>.servicebus.windows.net]; [ServiceBus-Entity, <my-queue-name>]; [ServiceBus-EntityType, Queue]; [TelemetryType, Request]})
    }
}
```

## Marking dependency tracking with correlation ID
Starting from v2.4, one can add a custom dependency ID when tracking Azure Key Vault dependencies. Our goal is to upgrade every dependency tracking in our library with the option to pass along a dependency ID. The reason we added this, is also related to the service-to-service big picture. Adding such an dependency ID to our tracking will help when one wants to link a tracked request to the dependency. A more thorough explanation about service-to-service correlation will follow. For now, it's already a big step that we can integrate dependency ID's in our tracking.

```csharp
using Microsoft.Extensions.Logging;

var durationMeasurement = new StopWatch();

// Start measuring
durationMeasurement.Start();
var startTime = DateTimeOffset.UtcNow;

var trackingId = "75D298F7-99FF-4BB8-8019-230974EB6D1E";

logger.AzureKeyVaultDependency(
    vaultUri: "https://my-secret-store.vault.azure.net", 
    secretName: "ServiceBus-ConnectionString", 
    isSuccessful: true, 
    startTime: startTime, 
    duration: durationMeasurement.Elapsed,
    dependencyId: trackingId);

// Output: {"DependencyType": "Azure key vault", "DependencyId": "75D298F7-99FF-4BB8-8019-230974EB6D1E", "DependencyData": "ServiceBus-ConnectionString", "TargetName": "https://my-secret-store.vault.azure.net", "Duration": "00:00:00.2521801", "StartTime": "03/23/2020 09:56:31 +00:00", "IsSuccessful": true, "Context": {}}
```

## Custom request ID generation
When tracking requests in Azure Application Insights, the ID of the request was previously a generated GUID. Not configurable at all. Arcus Observability v2.4 changes that. Consumers can pass in their own generation function and therefor fully control how the request ID in Azure Application Insights looks like.

This request ID is useful (for example) in a service-to-service correlation system where you want the ID of the incoming request to be based on the sending system, or you want to incorporate the operation ID in the request ID.

```csharp
using Serilog;
using Serilog.Configuration;

ILogger logger = new LoggerConfiguration()
    .WriteTo.AzureApplicationInsights("<key>", options =>
    {
        // Configurable generation function for the telemetry request ID.
        options.Request.GenerateId = () => $"my-custom-ID-{Guid.NewGuid()}";
    });
```

## .NET 6 support
.NET 6 is already released some time ago. One of our many requests was supporting this new framework. In library development, this is not always an easy process. 

Arcus wasn't yet taking any steps in supporting this new framework. Arcus Observability v2.4 takes the first step in adding .NET 6 support to Arcus. In this version we still support .NET Core 3.1 but we also already support .NET 6. Further releases across Arcus will also include this .NET 6 support so we can ultimately say that Arcus is fully .NET 6 supported.

When .NET Core is finally unsupported, we will fully rely on .NET 6. Until then, multi-support will be our goal.

## Conclusion
Arcus Observability v2.4 has a lot of new features, almost all related to our upcoming service-to-service correlation support. We also gradually support .NET 6 throughout Arcus, and hope to update the other libraries soon. 

See [our official documentation](https://observability.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.observability/issues/new/choose).

Thanks for reading!
-Arcus team