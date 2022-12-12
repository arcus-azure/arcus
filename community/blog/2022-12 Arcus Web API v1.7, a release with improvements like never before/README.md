# Arcus Web API v1.7, a release with improvements like never before
Arcus Web API v1.7 brings improvements to the table that make it the most production-ready release to date. It fully embraces Microsoft technology like never before.

## W3C HTTP correlation for automatic Microsoft dependency tracking
Arcus already had service-to-service correlation between Arcus components. A HTTP request was correlated into an Azure Service Bus message and so on. Each component was linked together in a parent-child relationship that can be seen in Azure Application Insights. This was already there; what was not were Microsoft dependencies. When discarding Arcus observability technology and only using Microsoft Application Insights service registration, you get automatic dependency tracking for Microsoft dependencies. This includes SQL operations, HTTP requests, Azure Service Bus messages and lots more. It was a real argument against Arcus, until the Web API v1.7 release.

Microsoft uses activities behind the scenes to set and get hold of the correlation of the application. Arcus used a dedicated registered service to do that. Starting from this release, both are used. Arcus makes sure that it sets and uses the correlation available in the current activity. This means that both any tracked Arcus dependencies as well as any Microsoft dependencies use the same information. This results in a system where both are working together instead of against each other. Any Microsoft dependencies will be tracked automatically in an Arcus-configured Web API and any non-Microsoft dependencies can be easily tracked with our dependency logger extensions. Best of both worlds, as they say.

⚡ Note that you only have to upgrade to the v1.7 release to make use of this new way of correlation. Not a single line of code has to be changed as all the complexity happens behind the scenes.

## Grouping API endpoints based on route parameters
When tracking HTTP requests on API endpoints with route parameters, Arcus previously distinguished those requests from each other. A different route parameter resulted in a different kind of operation name in Application Insights, while the API endpoint remained the same. This causes a lot of headaches when localizing a certain endpoint. This looks something like this:

![HTTP request tracking without route template](media/without-route-template.png)

Microsoft used the route template as the operation name, which represents the route parameter as the name and not the value. This means that all HTTP requests are grouped under the same API endpoint. The new Arcus Web API version now does this too, making request localization in Application Insights a lot easier.

![HTTP request tracking with route template](media/with-route-template.png)

## Full (isolated) Azure Functions support
With Arcus Templates, we are working hard to make every Azure Functions project template support an isolated functions framework. All but one have been enhanced except for the Azure Functions HTTP trigger project template. This template was missing critical functionality for it to be migrated. The v1.7 release contains this functionality. Usual API applications can make use of middleware components that Arcus uses to set the HTTP correlation, track the request, handle exceptions, and so on. The isolated variant of Azure Functions now also has the option to use middleware components but unfortunately, Microsoft does not use the same libraries for custom middleware. Therefore we had to implement these components again and re-use the already existing API functionality.

Now that the v1.7 release is published, we can make sure that the Azure Functions HTTP trigger project template can also benefit from both the newest correlation and the isolated functions framework.

This will look something like this:

```csharp
using Microsoft.Extensions.Hosting;

IHost host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.UseOnlyJsonFormatting()
               .UseFunctionContext()
               .UseHttpCorrelation()
               .UseRequestTracking()
               .UseExceptionHandling();
    })
    .Build();

host.Run();
```

## Conclusion
The new Arcus Web API v1.7 release is a big milestone. The fact that the biggest change is not even showing in the user's application code says something about the usability and quality of Arcus' implementation. We have changed the way correlation is handled, how this is tracked and where it could be used, like isolated Azure Functions. The next steps will be to make sure that every Arcus component supports this new W3C correlation.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.webapi/issues/new/choose).

Thanks for reading!
The Arcus team