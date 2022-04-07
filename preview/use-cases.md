# Use-cases

## Centralize secret management independent from application
Differentiating between configuration data and secrets is critical for the security application. HTTP ports, application name... can all be seen as public data but access tokens, private keys... should not be in the same group. Accessing them in a centralized manner and secure manner is therefore important.

The [Arcus secret store](https://security.arcus-azure.net/features/secret-store) is the answer. The secret store will be the single point of truth in interacting with required secrets for your application. Multiple 'secret providers' can be configured that accesses the secrets from external sources like: Azure Key Vault, HashiCorp Vault, Docker secrets, environment variables... and the secret store will provide a single access point for the application to fetch those secrets.

An example of how well the secret store integrates within an application:

```csharp
using Microsoft.Extensions.Hosting;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((context, config) => 
            {
                config.AddJsonFile("appsettings.json")
                      .AddJsonFile("appsettings.Development.json");
            })
            .ConfigureSecretStore((context, config, builder) =>
            {
#if DEBUG
                builder.AddConfiguration(config);
#endif
                var keyVaultName = config["KeyVault_Name"];
                builder.AddEnvironmentVariables()
                       .AddAzureKeyVaultWithManagedServiceIdentity($"https://{keyVaultName}.vault.azure.net");
            });
    }
}
```

For more information, see [our documentation site](https://security.arcus-azure.net/features/secret-store).

Blogs:
* [Introducing Arcus secret store - making secrets a first-class citizen](https://www.codit.eu/blog/introducing-secret-store-net-core/)
* [Advanced Arcus secret store features](https://www.codit.eu/blog/secret-store-arcus-security-v1-4/)

## Simplify telemetry tracking with contextual information
Tracking telemetry with useful information is not an easy task. Giving each telemetry instance enough contextual information, correlated with other telemetry... There are many platforms and logging systems that are doing a part of the work but not one system that combines them all.

[Arcus Observability](https://observability.arcus-azure.net/) is the answer. The library provides a custom [Azure Application Insights Serilog sink](https://observability.arcus-azure.net/Features/sinks/azure-application-insights) that combines the easy application logging from Serilog with the highly expanded contextual information of Azure Application Insights. The library extends Serilog in such a way that all Azure Application Insights features can be logged with the well-known `ILogger` abstraction.

```csharp
ILogger logger = ...

// Contextual information
var telemetryContext = new Dictionary<string, object>
{
    { "Customer", "Contoso"},
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

For more information, see [our documentation site](https://observability.arcus-azure.net/).

Blogs:
* [Introducing Arcus Observability](https://www.codit.eu/blog/announcing-arcus-observability/)
* [Measure a variety of dependencies](https://www.codit.eu/blog/measure-a-variety-of-azure-dependencies-with-observability-v0-2/)
* [Service-to-service correlation preparation](https://www.codit.eu/blog/service-correlation-preparation-net-6-support-in-arcus-observability-v2-4/)

## Fast project startup with scaffolding projects
The start of each project has often the same kind of process before the actual implementation can be written. Boilerplate code, infrastructure setup. This can be a kind of tedious and repetitive process as most beginnings are the same.

[Arcus Templates]() is the answer. The library provides production-ready .NET project templates to faster start you of with the actual business implementation. They have several project options to fully customize how the end-result project should look like. Changing the authentication mechanism? Other logging framework? It's all possible with the project templates. You run the .NET command and you are good to go!

```shell
// Install the project template
PM > dotnet new --install Arcus.Templates.WebApi

// Create new project from the template
PM > dotnet new arcus-webapi --name Arcus.Demo.WebAPI
```

For more information, see [our documentation site](https://templates.arcus-azure.net/).

Blogs:
* [Advanced project template features](https://www.codit.eu/blog/making-arcus-templates-more-powerful/)