# Out-of-the-box request tracking, simplified HTTP correlation & JWT authorization in Arcus Web API v1.0

We've shipped [Arcus Web API v1.0](https://github.com/arcus-azure/arcus.webapi/releases/tag/v1.0.1) which brings a couple of new features:
- Out-of-the-box Request tracking
- Making it easier to use HTTP correlation
- JWT Authorization
- Simplified NuGet package structure

Come and take a look at what it has to offer!

## JWT authorization

As of v1.0, we have renamed our existing `<name>` into `<>` because [we feel it's broader than just Managed Identity](https://github.com/arcus-azure/arcus.webapi/issues/149).
This component provides a mechanism that uses JWT (JSON Web Tokens) to authorize requests access to the web application.

This authorization process consists of the following parts:
* Find the OpenID server endpoint to request the correct access token
* Determine the request header name you want to use where the access token should be available

```csharp
public void ConfigureServices()
{
    services.AddMvc(mvcOptions => mvcOptions.Filters.AddJwtTokenAuthorization());
}
```

For more information, see the [docs](https://webapi.arcus-azure.net/features/security/auth/jwt).

## Out-of-the-box Request tracking

Starting from this version, we allow you to track incoming requests by using a new middleware component building on top of `ILogger.LogRequest` (👋 Arcus Observability).

```csharp
public void Configure(IApplicationBuilder app, IWebHostEvironment env)
{
    app.UseRequestTracking();

    ...
    app.UseMvc();
}
```

By default, we do not track the request body but do include most HTTP headers. However, for security reasons we have a default set of headers to omit or obfuscate.

Example:

`HTTP Request POST http://localhost:5000/weatherforecast completed with 200 in 00:00:00.0191554 at 03/23/2020 10:12:55 +00:00 - (Context: [Content-Type, application/json], [Body, {"today":"cloudy"}])`

As always, we allow you to fully configure it to how you want it to behave by using our fluent options API for `UseRequestTracking`:

<example>
For more information, see the [docs](https://webapi.arcus-azure.net/features/logging#logging-incoming-requests).

## Making it easier to use HTTP correlation

Up until now it was a bit cumbersome to start using HTTP correlation. We have added a more convenient way to start using HTTP correlation with Serilog with the following extensions:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpCorrelation();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseHttpCorrelation();
    
    Log.Logger = new LoggerConfiguration()
        .Enrich.WithHttpCorrelationInfo()
        .WriteTo.Console()
        .CreateLogger();
}
```

For more information on correlation, see the [docs](https://webapi.arcus-azure.net/features/correlation).

## Breaking changes

Last but not least, we have simplified our package structure to make it easier to keep track of dependencies.

Here is an overview:
- `Arcus.WebApi.Security.Authentication` and `Arcus.WebApi.Security.Authorization` are now consolidated into `Arcus.WebApi.Security`
- `Arcus.WebApi.Correlation` has been moved into `Arcus.WebApi.Logging`
* Starting from this version, the different packages `Arcus.WebApi.Security.Authentication` and `Arcus.WebApi.Security.Authorization` have been merged together in `Arcus.WebApi.Security`.
The reason for this was that the functionality in both packages is mostly all the time used togehter and doesn't have much meaning on its own.
* Starting from this version, we have decided to merge the correlation and logging functionality into a single package: `Arcus.WebApi.Logging`.
This for the very reason that both the functionality present in the correlation and logging packages is mostly all the time used together.
