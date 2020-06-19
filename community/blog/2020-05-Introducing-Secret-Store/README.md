Introducing Secret Store - Making secrets a first-class citizen in .NET Core
===

.NET Core provides a convenient way to read configuration from a variety of providers, without the application having to worry where they come from!

Here's a small example:

```csharp
// TODO
```

There is a rich ecosystem of configuration providers that you can use including some that give you access to secrets such as Azure Key Vault.

Unfortunately, it's easy to fall in the configuration trap where secrets are not handled like they should or 

Unfortunately, it's not easy to work with secrets; for example:

- Secrets should never be logged
- Secrets can be rotated so applications need to work with this (emphasize caching)
- Secrets are typically stored externally and require authentication
- Secret stores, such as Azure Key Vault, are designed for secrets only and tend to be used as secret stores


Unfortunately, using the built-in configuration approach is not ideal for working with secrets.

- There is no clear indication when our app is working with secrets or configuration
- Security is important
- Easy to fall in the configuration trap
- .NET Core has no concept of secrets similar to IConfiguration
    - https://github.com/dotnet/runtime/issues/36035
- Arcus to the rescue
    - We allow you to register all secret providers during startup
    - We have an open model allowing you to easily add more providers

## Introducing Secret Store

With Arcus, we've decided that it's time to make secrets a first-clas sitizen in .NET Core - Introducing Secret Store!

Secret Store allows you to configure the secret providers during startup:

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

It's important to see that it gives you access to IConfiguration so that you can read configuration for your secret stores, such as Azure Key Vault URI, and consume those.

Once everything is setup, you can consume secrets in your application by using our `ISecretProvider` which will query the sources for secrets:

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

Out-of-the-box we provide secret provider for environment variables, Azure Key Vault and IConfiguration (which you should only be used for local development).

## Build your own provider

Thanks for reading,

Tom.

----

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Sweet! I definitely agree we need to treat secrets separately from other config and this does it nicely!</p>&mdash; Shahid Iqbal (@ShahidDev) <a href="https://twitter.com/ShahidDev/status/1273570627971137542?ref_src=twsrc%5Etfw">June 18, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>