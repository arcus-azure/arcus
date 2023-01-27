# Provide built-in W3C correlation and isolated Azure Functions in Arcus Templates v1.1
The last release was a major one, but this v1.1 release brings whole new features that take the Arcus project templates to a production-ready and future-proof level.

## Azure Functions HTTP trigger project template
Isolated Azure Functions were already present in the previous release. With a simple project option, the consumer could choose between an in-process or isolated environment for the project. The HTTP trigger was left behind because it was waiting for the new Web API release that brings our entire API middleware functionality to the Azure Functions environment. At the same time, the v1.1 release makes sure that the Azure Functions HTTP trigger project template is updated with the newest correlation system called W3C. Luckily, the biggest migration changes are internal ([Learn more about how the Arcus Observability update](https://github.com/arcus-azure/arcus.observability/releases/tag/v2.7.0)).

We have leveraged the Azure Functions middleware components to implement our necessary Arcus functionality. The result is both clean and readable. This is a portion of what we built-in provide:

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Program
{
    public IHostBuilder CreateHostBuilder(string[] args)
    {
        return Host.CreateDefaultBuilder(args)
                   .ConfigureServices(services =>
                   {
                        services.AddAppName("Azure HTTP Trigger");
                        services.AddAssemblyAppVersion<Program>();
                   })
                   .ConfigureFunctionsWorkerDefaults((context, builder) =>
                   {
                        builder.ConfigureJsonFormatting(options =>
                        {
                             options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                             options.Converters.Add(new JsonStringEnumConverter());
                        });

                        // Middleware pipeline:
                        builder.UseOnlyJsonFormatting()
                               .UseFunctionContext()
                               .UseHttpCorrelation()
                               .UseRequestTracking()
                               .UseExceptionHandling();
                   })
                   .ConfigureSecretStore((config, stores) => ...);
    }
}
```

The order of middleware components is chosen carefully. We provide a JSON formatting guard before any other call gets through. Non-JSON requests get immediately blocked by a `415 UnsupportedMediaType` response. Correct requests automatically get correlated and tracked. This means that [the information of the incoming request will be available to any registered application services](https://observability.arcus-azure.net/Features/correlation) and that any subsequent dependencies will be correlated to the request. An additional middleware component will make sure that any unexpected exceptions will be handled safely without exposing sensitive information to the client.

Since all infrastructure code is placed within middleware components, the function definition only contains business logic. This is a big difference from how we implemented in-process Azure Functions. Since in-process environments do not support middleware or any other infrastructure components. 

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

public class OrderFunction
{
    [Function("order")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "v1/order")] HttpRequestData request,
        FunctionContext context)
    {
        ILogger logger = context.GetLogger<OrderFunction>();
        logger.LogInformation("C# HTTP trigger 'order' function processed a request");

        var order = await request.ReadFromJsonAsync<Order>();
        HttpResponseData response = request.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(order);

        return response;
    }
}
```

## W3C correlation in remaining project templates
Continuing on [the Observability update](https://github.com/arcus-azure/arcus.observability/releases/tag/v2.7.0), we have made sure that all project templates support W3C correlation. The only visual change you will see is that we now centralize the telemetry application name and role so that both Arcus and Microsoft functionality can use this information during telemetry tracking. This shows how great both frameworks can work together and enhance each other to make a useful and clear correlation application map overview. 

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

## Streamlining functionality across project templates
Features developed in other Arcus libraries always find a way to enhance the project templates. This v1.1 release also brings in new Web API and Security features that were previously released and are now built-in available. Simpler certificate validation registration and synchronous secret retrieval are the major ones. But, sometimes project templates evolve separately and need to be streamlined afterward.

Some project templates were providing ways to easily start up the project as both a Docker container and from the project itself. This brings great development experience as the result of a project template can be run directly, with ease. The problem was that not every project template was having this functionality. The v1.1 release changed that.

✅ Running the project result of a project template in both environments is also a great improvement during the maintenance of the templates. Issues, problems or new features are often inspected by running the project template manually and inspecting the results. If the project is by default ready to be run, it only brings joy to the people maintaining it.

## Conclusion
The Arcus Templates v1.1 release brings real value to project development. It now provides W3C correlation, isolated Azure Functions and the latest Arcus features to kickstart your project. This blog post only goes over the major changes but it does not by far encapsulates everything. See our  [v1.1 release notes](https://github.com/arcus-azure/arcus.templates/releases/tag/v1.1.0) to learn more about this major release and our [official documentation](https://templates.arcus-azure.net/) for more information on all the provided project templates in this library.

🚩 If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.templates/issues/new/choose).

Thanks for reading!
The Arcus team