# The final W3C correlation puzzle piece in Arcus Observability v2.7
What started as a wish for an easier and more quality telemetry correlation finally received its final puzzle piece. Read more to see what this final piece is all about.

## Reusing telemetry component information
The last couple of Arcus releases were all about W3C correlation and how we can let the telemetry of Microsoft and Arcus work together. Internal correlation IDs were set and reused so that both parties are talking about the same thing. One of the things missing, though, was metadata information. Telemetry from Microsoft didn't know about the component name that we are using with our Arcus telemetry, for example. You won't see any problem in the transaction trace, but you will see strange things happen in the application map on Application Insights as it would seem that a single component is split in two - one for Arcus, one for Microsoft.

Observability v2.7 provides some nifty features to overcome this issue. By centralizing the component name and version, we can use this metadata information in both the Arcus Serilog Application Insights sink as well as configure Microsoft's `TelemetryClient`. This not only fixes the problem in the application map but also makes sure that people can even use the `TelemetryClient` directly if they want to control lower-level values.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Configuration;

public void ConfigureServices(IServiceCollection services)
{
    services.AddAppName("My application component");
    services.AddAssemblyAppVersion<Program>();
}

public void ConfigureApp(IServiceProvider provider)
{
    Log.Logger = new LoggerConfiguration()
        .Enrich.WithComponentName(provider)
        .Enrich.WithVersion(provider)
        .CreateLogger();
}
```

⚠ Keep in mind that Observability is an abstraction of a correlation implementation, it does not represent the implementation itself. Use our Web API or Messaging libraries instead where you can use these features on top of them.

For more information on our available Serilog enrichers, see [our dedicated feature documentation](https://observability.arcus-azure.net/Features/telemetry-enrichment).

## Updated service-to-service correlation user guides
With a new correlation system, comes new user guides. We have updated all our user guides to be W3C compatible. The fun thing is that there are not many code additions but mostly code deletions. The reason for this is that several of Microsoft's functionality is now included in the telemetry tracking, without any additional code. HTTP clients, Azure messaging clients, and other types can be registered like before and work seamlessly with our Arcus telemetry.

We have also created new diagrams with pseudo-correlation IDs to show how components work together.

![W3C API diagram](media/w3c-api-diagram.png)

## Simplifying library structure
What v2.7 also did was simplify the available libraries. Previously, we had a dedicated library for tracking SQL and IoT Hub dependencies because we wanted to reuse Microsoft libraries to parse connection strings. The result of this parsing was then used as dependency information. The problem, though, was that this resulted in a lot of libraries and dependencies.

The solution to this was to deprecate these smaller libraries and bring these additional dependency overloads back to the core package. We have created a light version of the connection string parsing so that we do not need any additional Microsoft libraries. Of course, we have created lots of tests [that border with property-based testing](https://www.codit.eu/blog/data-driven-testing-as-a-step-towards-property-based-testing/) to harden this critical part.

## Conclusion
W3C correlation is interwoven in several recent Arcus updates. It is an amazing feature that will bring a lot of added value to projects. This Observability update brings the last piece of the correlation puzzle. The result is an easy-to-use, production-ready correlation system that fully supports any built-in Microsoft technology. Take a look at the [release notes](https://github.com/arcus-azure/arcus.observability/releases/tag/v2.7.0) to learn more about this release.

See [our official documentation](https://observability.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.observability/issues/new/choose).

Thanks for reading!
The Arcus team