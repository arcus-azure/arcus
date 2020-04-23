# Announcing Arcus.Observability v0.1

Recently we released v0.1 of the [Arcus.Observability](https://github.com/arcus-azure/arcus.observability/releases/tag/v0.1.0) project and is available on NuGet.
This new library will boost setup and usage of telemetry for new and existing projects.

The library takes two things in mind:
- Application Insights could/should be used to send the telemetry information to
- Serilog via the abstracted Microsoft logging functionality is the recommanded approach when writing telemetry information

Take a look what it has to offer!

## Writing Different Types of Telemetry

The [Arcus.Observability.Telemetry.Core](https://www.nuget.org/packages/Arcus.Observability.Telemetry.Core/) library provides a whole bunch of extensions on the abstracted `ILogger` Microsoft type that makes logging all the Application Insights telemetry types (Events, Traces, Metrics, Dependencies, ...) a piece of cake.

```csharp
logger.LogEvent("Order Created");
// Output: "Events Order Created (Context: )"

var telemetryContext = new Dictionary<string, object>
{
    { "InvoiceId", "ABC"},
    { "Vendor", "Contoso"},
};

logger.LogMetric("Invoice Received", 133.37, telemetryContext);
// Output: "Metric Invoice Received: 133.37 (Context: [InvoiceId, ABC], [Vendor, Contoso])"
```

**Dependencies**

For the dependency telemetry (HTTP, SQL, ... and custom ones) that has to be measured when logging, we provide an easy way.
By using the `DependencyMeasurement` type, we handle the start/duration for you.

Following example shows how a HTTP dependency is logged:

```csharp
var telemetryContext = new Dictionary<string, object>
{
    { "Tenant", "Contoso"},
};

// Create request
var request = new HttpRequestMessage(HttpMethod.Post, "http://requestbin.net/r/ujxglouj")
{
    Content = new StringContent("{\"message\":\"Hello World!\"")
};

// Start measuring
using (var measurement = DependencyMeasurement.Start())
{
    // Send request to dependant service
    var response = await httpClient.SendAsync(request);
    
    _logger.LogHttpDependency(request, response.StatusCode, measurement, telemetryContext);
    // Output: "HTTP Dependency requestbin.net for POST /r/ujxglouj completed with 200 in 00:00:00.2521801 at 03/23/2020 09:56:31 +00:00 (Successful: True - Context: [Tenant, Contoso])"
}
```

For more information, see [docs](https://observability.arcus-azure.net/features/writing-different-telemetry-types).

## A Conventional Way to Correlate

The [Arcus.Observability.Correlation](https://www.nuget.org/packages/Arcus.Observability.Correlation/) library provides a conventional way to use correlation in applications.
It provides a 'basic' model called `CorrelationInfo` with two properties:
- Transaction Id - ID that relates different requests together into a functional transaction.
- Operation Id - Unique ID information for a single request.

The correlation can be accessed through throughout the application via an `ICorrelationInfoAccessor` implementation.

The purpose of this library is to provide a basic setup in the most general way but what it doesn't include is how this correlation is initially retrieved because this is application-specific. It's up to the consumer to call the `ICorrelationInfoAccessor.SetCorrelation` at the right moment.

For an example of a specific implementation, we recommand to look at the [Web Api](https://webapi.arcus-azure.net/features/correlation) version and how it contains a [`HttpCorrelationInfoAccessor`](https://github.com/arcus-azure/arcus.webapi/search?q=httpcorrelationinfoaccessor&unscoped_q=httpcorrelationinfoaccessor) that uses the HTTP request features to access this correlation information for each incoming HTTP request.

For more information on how the correlation in this library can be configured and how customization can be done, see the [docs](https://observability.arcus-azure.net/features/correlation).

## Boosted Serilog Functionality

To improve writing telemetry information via Serilog, we added some extra functionality, split into enriching existing telemetry logs, filtering telemetry logs based on the type of the telemetry, and updating the Application Insights sink for Serilog so it uses the full capabilities of telemetry information.

### Enrichment

The [Arcus.Observability.Telemetry.Serilog.Enrichers](https://www.nuget.org/packages/Arcus.Observability.Telemetry.Serilog.Enrichers/) library provides several [Serilog Enrichers](https://github.com/serilog/serilog/wiki/Enrichment) to add commonly added information to the telemetry logs:

- [Application enricher](https://observability.arcus-azure.net/features/telemetry-enrichment#application-enricher) adds a 'ComponentName' to the logs which can be for dependency tracking in Application Insights.
- [Correlation enricher](https://observability.arcus-azure.net/features/telemetry-enrichment#correlation-enricher) adds the information of the current `CorrelationInfo` instance and is customizable to use your own `ICorrelationInfoAccessor`.
- [Kubernetes enricher](https://observability.arcus-azure.net/features/telemetry-enrichment#kubernetes-enricher) adds machine information of the environment related to Kubernetes.
- [Version enricher](https://observability.arcus-azure.net/features/telemetry-enrichment#version-enricher) adds the current runtime assembly version of the product.

For more information, see [docs](https://observability.arcus-azure.net/features/telemetry-enrichment).

### Sinking to Application Insights

It may seem strange to provide a [Serilog sink](https://github.com/serilog/serilog/wiki/Configuration-Basics#sinks) for Application Insights, when [there already exists one](https://github.com/serilog/serilog-sinks-applicationinsights). The reason for this, is because the already available sink only provides support for traces and events while Application Insights provides support for a lot more.

The Serilog sink available in [Arcus.Observability.Telemetry.Serilog.Sinks.ApplicationInsights](https://www.nuget.org/packages/Arcus.Observability.Telemetry.Serilog.Sinks.ApplicationInsights/) builds upon the already available sink but provides the additional functioality to support all the different telemetry types in Application Insights (requests, dependencies, metrics...).

Following example shows how this sink can be configured in your Serilog setup:

```csharp
ILogger logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.AzureApplicationInsights("<key>")
    .CreateLogger();
```

For more information, see [docs](https://observability.arcus-azure.net/features/sinks/azure-application-insights).

### Filtering

When writing to Application Insights, some telemetry types can be filtered-out using the the available Serilog filter.
This functionality is available in the [Arcus.Observability.Telemetry.Serilog.Filters](https://www.nuget.org/packages/Arcus.Observability.Telemetry.Serilog.Filters/) library.

The following example shows how telemetry events can be filtered out:

```csharp
ILogger logger = new LoggerConfiguration()
    .WriteTo.AzureApplicationInsights("<key>")
    .Filter.With(TelemetryTypeFilter.On(TelemetryType.Events))
    .CreateLogger();
```

For more information, see [docs](https://observability.arcus-azure.net/features/telemetry-filter).