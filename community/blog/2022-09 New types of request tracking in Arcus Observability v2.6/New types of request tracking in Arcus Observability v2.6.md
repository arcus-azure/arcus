# New types of request tracking in Arcus Observability v2.6
The Arcus Observability v2.6 release contains all sorts of new ways to track requests in Application Insights. Let's have a look!

Previously, we only supported HTTP and Azure Service Bus request tracking in our telemetry extensions. The v2.6 expands on this with great new and extensible ways to track telemetry.

## Azure EventHubs request tracking
We are working on fully supporting Azure EventHubs in our [Messaging library](https://messaging.arcus-azure.net/). This means that we should be able to track EventHubs requests, as the messaging system will retrieve and process these events. When we update our Messaging library, events that gets processed by your implemented message handlers will automatically be tracked.

```csharp
using Microsoft.Extensions.Logging;

ILogger logger = ...

bool isSuccessful = false;
using (var measurement = DurationMeasurement.Start())
{
    try
    {
        // Process event...
    }
    finally
    {
        logger.LogEventHubsRequest("<my-eventhubs-namespace>", "<my-eventhubs-name>", isSuccessful, measurement);
        // Output: Azure EventHubs from Process completed in 0.00:12:20.8290760 at 2021-10-26T05:36:03.6067975 +02:00 - (IsSuccessful: True, Context: {[EventHubs-Namespace, <my-eventhubs-namespace>]; [EventHubs-Name, <my-eventhubs-name>]; [EventHubs-ConsumerGroup, $Default]; [TelemetryType, Request]})
    }
}
```

We also provide overloads that take in an additional Azure EventHubs consumer group and an operation name which provides a functional description of the event.

## Azure Functions (isolated) HTTP trigger request tracking
With the arrival of isolated Azure Functions, processing HTTP requests has changed. Previously, we were able to re-use the ASP.NET Core `HttpRequest`/`IActionResult` but the isolated HTTP trigger variant stepped away from the reusable approach and uses new types: `HttpRequestData`/`HttpResponseData`. This impact how we track events with our Observability library as there is no default conversion available between the two approaches.

Therefore, Observability v2.6 introduces a new set of `LogRequest` overloads in the `Arcus.Observability.Telemetry.AzureFunctions` package that uses `HttpRequestData` instead of `HttpRequest`.

```csharp
using System.Net;
using Microsoft.Extensions.Logging;

public async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/order")] HttpRequestData request,
    FunctionContext executionContext)
{
    var statusCode = default(HttpStatusCode);
    using (var measurement = DurationMeasurement.Start())
    {
        try
        {
            // Processing...
            statusCode = HttpStatusCode.Ok;
            return request.CreateResponse(statusCode)
        }
        finally
        {
            logger.LogRequest(request, statusCode, measurement);
            // Output: {"RequestMethod": "POST", "RequestHost": "http://localhost:5000/", "RequestUri": "http://localhost:5000/v1/order", "ResponseStatusCode": 200, "RequestDuration": "00:00:00.0191554", "RequestTime": "03/23/2020 10:12:55 +00:00", "Context": {}}
        }
    }
}
```

Our [Templates library](https://templates.arcus-azure.net/) will receive an update that provide you with an Azure Functions (isolated) HTTP trigger project template which will use this request tracking out-of-the-box. Note that isolated Azure Functions are able to work with custom middleware components, so the request tracking will (just like regular API applications) run in the background and not pollute your application code like with in-process Azure Functions.

## Custom request tracking
Adding these new types of request tracking got us thinking that people should be able to extend this. We already provided a way to track custom dependencies, which is in fact a way to support systems that aren't built-in supported with our Observability library. Before v2.6, we didn't provide such an extension for custom requests. With this extension, consumers can fully extend and use our library in any system possible. And because service-to-service correlation relies on the request/dependency relationship we can say with confidence that we are able to provide service correlation to any system.

```csharp
using Microsoft.Extensions.Logging;
bool isSuccessful = false;
// Start measuring.
using (var measurement = DurationMeasurement.Start())
{
    try
    {
        // Processing message...
        isSuccessful = true;
    }
    finally
    {
        logger.LogCustomRequest("<my-request-source>", "<operation-name>", isSuccessful, measurement);
        // Output: Custom <my-request-source> from Process completed in 0.00:12:20.8290760 at 2021-10-26T05:36:03.6067975 +02:00 - (IsSuccessful: True, Context: {[TelemetryType, Request]})
    }
}
```

## Conclusion
This new release contains besides the new types of request tracking also bunch of changes and fixes that improves the entire telemetry tracking experience. Take a look at the [release notes](https://github.com/arcus-azure/arcus.observability/releases/tag/v2.6.0) and [feature documentation](https://observability.arcus-azure.net/) to learn more about Arcus Observability.

See [our official documentation](https://observability.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.observability/issues/new/choose).

Thanks for reading!
-Arcus team