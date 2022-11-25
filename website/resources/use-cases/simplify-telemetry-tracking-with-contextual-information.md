---
title: Simplify telemetry tracking with contextual information
slug: simplify-telemetry-tracking-with-contextual-information
order: 1
description: Tracking telemetry with useful information is not an easy task. Giving each telemetry instance enough contextual information, correlated with other telemetry...
components:
  - Arcus Observability
---

# Simplify telemetry tracking with contextual information

Tracking telemetry with useful information is not an easy task. Giving each telemetry instance enough contextual information, correlated with other telemetry... There are many platforms and logging systems that are doing a part of the work but not one system that combines them all.

[Arcus Observability](https://observability.arcus-azure.net/) is the answer. The library provides a custom [Azure Application Insights Serilog sink](https://observability.arcus-azure.net/Features/sinks/azure-application-insights) that combines the easy application logging from Serilog with the highly expanded contextual information of Azure Application Insights. The library extends Serilog in such a way that all Azure Application Insights features can be logged with the well-known `ILogger` abstraction.

```csharp
ILogger logger = ...

// Contextual information
var telemetryContext = new Dictionary<string, object>
{
    { "Customer", "Contoso"},
    { "OrderId", "12345" }
};

// Events
logger.LogEvent("Order Created", telemetryContext);

// Dependencies
using var measurement = DurationMeasurement.Start();
logger.AzureKeyVaultDependency(vaultUri: "https://my-secret-store.vault.azure.net", secretName: "ServiceBus-ConnectionString", isSuccessful: true, measurement, telemetryContext);

// Requests
using var measurement = DurationMeasurement.Start();
logger.LogRequest(httpContext.Request, httpContext.Response, measurement, telemetryContext);

// Metrics
logger.LogMetric("Orders Received", 133, telemetryContext);
```

The Arcus observability is by-default integrated in [all our .NET project templates](https://templates.arcus-azure.net/)!
For more information, see [our documentation site](https://observability.arcus-azure.net/).

Blogs:

- [Introducing Arcus Observability](https://www.codit.eu/blog/announcing-arcus-observability/)
- [Measure a variety of dependencies](https://www.codit.eu/blog/measure-a-variety-of-azure-dependencies-with-observability-v0-2/)
- [Service-to-service correlation preparation](https://www.codit.eu/blog/service-correlation-preparation-net-6-support-in-arcus-observability-v2-4/)
