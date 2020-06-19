Introducing Secret Store - Making secrets a first-class citizen in .NET Core
===

.NET Core provides a convenient way to read configuration from a variety of providers, without the application having to worry where they come from!

Here's a small example from the documentation:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureAppConfiguration((hostingContext, config) =>
        {
            var environment = hostingContext.HostingEnvironment;
            var config = config.Build();
            
            // Create an Azure Key Vault client with Managed Identity authentication
            var azureServiceTokenProvider = new AzureServiceTokenProvider();
            var keyVaultClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));

            // Lookup the configuration from JSON
            config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                  .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
                  // Lookup the configuration from Azure App Configuration - https://docs.microsoft.com/en-us/azure/azure-app-configuration/overview
                  .AddAzureAppConfiguration(settings["ConnectionStrings:AppConfig"]);
                  // Lookup secrets from Azure Key Vault client with Managed Identity authentication
                  .AddAzureKeyVault($"https://{config["KeyVaultName"]}.vault.azure.net/", keyVaultClient, new DefaultKeyVaultSecretManager());
                  // Lookup configuration from environment variables as a last resort
                  .AddEnvironmentVariables();
        })
```

.NET has a rich ecosystem of configuration providers that you can use, either provided by Microsoft or as part of the (open-source) community. One of my favorite ones is [Andrew Lock's YAML configuration provider](https://github.com/andrewlock/NetEscapades.Configuration) which I use extensively for Promitor.

## So, what's the problem?

There are a variety of providers that give you access to secrets as well, such as Azure Key Vault or HashiCorp Vault - And this is where the problem lies.

Unfortunately, it's not easy to work with secrets; you have to keep these things in mind:

- Secrets stores are typically hosted remotely (which means network interactions), require authentication and apply rate limiting
- Secrets should be cached in memory for a short period to avoid too chatty apps & rate limiting
- Secrets can be rotated so your app needs to be aware of this
- Secrets should never be logged
- Secret stores are for secrets only, so they should not be used as configuration stores

In order to really handle these aspects well, you have to know that you are interacting with either a config value or a secret but there is no seperation in .NET Core. It's too easy to fall in the configuration trap where secrets are not handled how they should.

You could make the argument that  developers know they are working with secrets when they are looking them up but their future colleagues might not give it enough attention.

Another problem is that with the current configuration model it will check every provider until it has found a match for the configuration key, this could result in a lot of unrequired calls to your secret stores which will end up in throttling.

In March, [I've suggested to introduce a secret store concept in .NET](https://github.com/dotnet/runtime/issues/36035) but the team is not convinced that there are enough benefits for it and will stick with configuration concept for now.

That's where Arcus comes in.

## Introducing Secret Store

With Arcus, we've decided that it's time to make secrets as a first-class citizen in .NET Core - We are happy to introduce Secret Store!

Secret store is built on the same constructs of .NET Core's configuration allowing you to define the secret providers you want to use and consume them very easily in your application later on. We give you full separation between interacting with configuration & secrets.

With Secret Store, we are building on our current `ISecretProvider` & `ICachedSecretProvider` but we've made it a lot simpler to use them across multiple stores!

Let's have a look!

### What Secret Store looks like

With Secret Store, you can use the allows you to configure the secret providers during startup:

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureHostConfiguration(configBuilder =>
            {
                configBuilder.AddJsonFile("appsettings.Development.json")
                             .AddJsonFile("appsettings.json");
            })
            .ConfigureSecretStore((context, config, builder) =>
            {
#if DEBUG
                builder.AddConfiguration(config);
#endif
                var keyVaultName = config["KeyVault_Name"];
                builder.AddEnvironmentVariables()
                       .AddAzureKeyVaultWithManagedServiceIdentity($"https://{keyVaultName}.vault.azure.net");
            })
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
}
```

In this example, we are configuring our application to read secrets from environment variables and Azure Key Vault (which uses Managed identity).

For local debugging (💘 build directives), our application gets access to the configuration so that we don't have to fiddle around with Azure Key Vault authentication or rely on the internet. However, it's up to you to choose where they should come from!

It's important to note here that you can fully query the configuration to configure your secret providers, for example, to determine the Azure Key Vault URI, and consume those.

Once everything is set up, you can consume secrets in your application by using our `ISecretProvider` which will query the sources for secrets:

```csharp
[ApiController]
[Route("api/v1/weather/forecast")]
public class WeatherForecastController : ControllerBase
{
    private readonly ISecretProvider _secretProvider;

    public WeatherForecastController(ISecretProvider secretProvider)
    {
        _secretProvider = secretProvider;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        string apiKey = await _secretProvider.GetRawSecretAsync("Weather-API-Key");

        var weatherForecast = await GetWeatherForecastAsync(apiKey: apiKey);
        return Ok(weatherForecast);
    }

    private async Task<object> GetWeatherForecastAsync(string apiKey)
    {
        throw new NotImplementedException();
    }
}
```

Out-of-the-box we provide secret providers for environment variables, Azure Key Vault and IConfiguration but we provide an extensible model so [you can easily bring-your-own providers](https://security.arcus-azure.net/features/secret-store/create-new-secret-provider)!

However, you should strive to not read secrets from configuration files unless you have a good reason because it's not secure.

## What's next?

The **power of secret store lies in the secret providers** that you can use! So we'll add more over time, but [let us know](https://github.com/arcus-azure/arcus.security/issues/new?labels=secret-store%2C+secret-provider&template=New-secret-provider.md) what secret providers you'd like to use.

Another thing **we will look at is if we should provide an extension model where you can inject in the pipeline** so that you can do things such as writing audit logs, measure dependencies, write metrics for how many times you interact with a secret store, etc.

Over the past year, I've been thinking if seperating this makes sense or only gives more overhead but it was pretty clear that this is a gap in the framework and I'm not the only one:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sweet! I definitely agree we need to treat secrets separately from other config and this does it nicely!</p>&mdash; Shahid Iqbal (@ShahidDev) <a href="https://twitter.com/ShahidDev/status/1273570627971137542?ref_src=twsrc%5Etfw">June 18, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We'll see what the **adoption of Secret Store is** and if we see a lot of people using it **we might want to restart the conversation [to bake into .NET](https://github.com/dotnet/runtime/issues/36035)** so that everybody can benefit from it. But until then you can use Arcus and [let us know what you think it missing](https://github.com/arcus-azure/arcus.security/issues/new/choose).

- Evaluate a model to inject in the pipeline and use auditing/metrics/etc.

Thanks for reading,

Tom.