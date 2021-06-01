# Enhanced request tracking in Arcus.WebApi v1.3

[Arcus Web API](https://github.com/arcus-azure/arcus.webapi) v1.3 is all about request tracking. Previous versions introduced the request tracking concept as a way to track the incoming HTTP request and outgoing HTTP response with a limited set of knobs to tweak such as to request/response body, headers, the time it took to process the request...

This new version takes this to a whole new level so that your next project can benefit from a production-ready request tracking functionality!

## Omit entire routes from the request tracking

Initially, the request tracking was tracking all routes. This was a good first basic approach but when more realistic scenario's comes into play, this is rather cumbersome.

For example, health endpoints to track the health of your web API add noise to your telemetry pipeline without a lot of added value. Especially when they are called often, and the result is almost always a success.

You can now annotate API controllers and routes with our new `ExcludeRequestTracking` attribute which will ensure that the entire request tracking functionality will be excluded:

```csharp
using Arcus.WebApi.Logging;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [ExcludeRequestTracking]
    public IActionResult Get()
    {
        // Determine health status...
        return Ok();
    }
}
```

When such a health endpoint is generated (like [Dapr](https://docs.dapr.io/developing-applications/building-blocks/observability/sidecar-health/)) and you have no control over where the this endpoint is hosted, you can't really add this attribute. For those scenarios we added an additional option to the configurable request tracking options:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRequestTracking(options => options.OmitRoutes.Add("/api/v1/health"));
    }
}
```

## Only track certain HTTP status codes

As a continuation of the previous health endpoints example. It would be even better if we only could see health failures and disregard all success statuses. That would be both make the tracking more cleaner and help with defect detection when something's wrong.

We created an `[RequestTracking]` attribute to pass along either a fixed HTTP status code or a range of HTTP status status codes.
These status codes will act as an **allow list**. The request tracking will only happen when the HTTP response's status code is within the configured status code range.

In the following example, the request tracking of the health endpoint will only happen when the HTTP response's status code is minimum 500 or maximum 599 (range is inconclusive).

```csharp
using Arcus.WebApi.Logging;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [RequestTracking(500, 599)]
    public IActionResult Get()
    {
        // Determine health status...
        return Ok();
    }
}
```

These HTTP status code ranges can also be specified in the global request tracking options. The request tracking will then only happen when **every** HTTP response's status code is within this specified range.

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRequestTracking(options => options.TrackedStatusCodeRanges.Add(new StatusCodeRange(500, 599));
    }
}
```

> Note that the `[RequestTracking]` attribute can be combined with the `TrackedStatusCodeRanges` option. The request tracking will then happen when the HTTP response's status is within both status code ranges.

## Finer grained request/response body exclusion

Tracking the HTTP request and/or response body can be quite expensive. Sometimes the request is worth tracking but the bodies are just to great to be included in the telemetry. We already provided in previous versions an request tracking option to opt-in for the inclusion of the HTTP request/response bodies, but this option acted on a global level. A finer control was required.

We created an `[RequestTracking]` where you can pass an exclusion filter. This filter will determine whether or not the HTTP request/response should be excluded for that specific route.
The following example shows how an HTTP request body can be excluded from the request tracking, in combination when the `IncludeRequestBody` option is set:

```csharp
using Arcus.WebApi.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [RequestTracking(Exclude.RequestBody)]
    public IActionResult Get()
    {
        // Determine health status...
        return Ok();
    }
}

public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRequestTracking(options => options.IncludeRequestBody = true);
    }
}
```

We have also created buffers so that you can specify how much of the HTTP request/response body should be included in the telemetry. This can be useful to get a general idea of the bodies but prevent the telemetry entries from being overloaded.

## Conclusion

In this post we looked at some new request tracking features that are included in the v1.3 release. For more information about request tracking, see our [official documentation](https://webapi.arcus-azure.net/features/logging#logging-incoming-requests) where we go in-depth into all the available attributes and options.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.webapi/issues/new/choose).
Thanks for reading!

The Arcus team
