# The power of Arcus secret store

A question we get a lot, is what added-value the Arcus secret store provides. 'Why not use the Azure Key Vault SDK directly?'
In this post we'll take a look at the true power of the Arcus secret store so you understand why you should use the Arcus secret store in your next project.

The Arcus secret store is available as part of [Arcus security](https://github.com/arcus-azure/arcus.security) and contains thorough [documentation](https://security.arcus-azure.net/) if you want to explore other features available.

## What is Arcus Secret Store?

The Arcus secret store is a system that provides secrets located from various sources through a single access point. In a more complex application, secrets values can be located in Azure Key Vault(s), environment variables, HashiCorp Vault(s), development configuration files...

The Arcus secret store lets you access all of them with a single call instead of using specific SDKs to access them separately.

In many ways, the secret store looks similar to the [ASP.NET Core configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/) with some subtle but powerful differences.

Some terminology:
* A **Secret** is a notion of sensitive information that needs to be stored securely such as authentication keys, passwords, connection strings, client secrets...
* A **Secret provider** allows you to fetch secrets from a given secret source. While we support various sources such as Azure Key Vault, HashiCorp Vault, environment variables, and more, you can even build your own secret provider!
* A **Secret store** is a convenient way to query all configured secret providers with a single call, allowing you to configure all the various sources once and leave it up to us.

An example of a simple secret store configuration is shown here:

```csharp
using Arcus.Security.Core.Caching.Configuration;
using Microsoft.Extensions.Hosting;

class Program
{
    public static void Main(string[] args)
    {
        return CreateHostBuilder(args).Build().Run();
    }

    public IHostBuilder CreateHostBuilder(string[] args)
    {
        return Host.CreateDefaultHostBuilder(args)
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

> 💡 When a secret is being retrieved, the secret providers are being called in the order they were registered. So in this case, the environment variables will be checked before the Azure Key Vault is contacted.

The secret store is also available for [Azure Functions](https://security.arcus-azure.net/features/secret-store/#using-secret-store-within-azure-functions) and [can be configured outside the `Program`](https://security.arcus-azure.net/features/secret-store/#configuring-secret-store-without-net-host-builder).

Let's look at the advantages of using our Arcus secret store.

## Caching

A feature that makes the secret store unique, is caching. This makes sure that registered secret providers won't be called upon every secret retrieval. This helps you avoiding hitting service limitations.
The secret store also allows you to define your own caching strategy for [custom secret providers](https://security.arcus-azure.net/features/secret-store/create-new-secret-provider) or extending existing ones.

The caching functionality acts as a 'wrapper' arround existing secret providers. Any secret provider you can think of can be 'wrapped' into a cached version.

```csharp
using Arcus.Security.Core.Caching;
using Arcus.Security.Core.Caching.Configuration;
using Arcus.Security.Core.Providers;

.ConfigureSecretStore((config, stores) =>
{
    // Configuration cache (optional: default is 5 min).
    var cacheConfiguration = new CacheConfiguration(TimeSpan.FromMinutes(10));

    // Built-in secret providers.
    var environmentVariables = new EnvironmentVariableSecretProvider();
    var cachedEnvironmentVariables = new CachedSecretProvider(environmentVariables, cacheConfiguration);

    // Custom secret providers.
    var windowsRegistry = new WindowsRegistrySecretProvider();
    var cachedWindowsRegistry = new CahcedSecretProvider(windowsRegistry, CacheConfiguration.Default);
});
```

See also our [asynchrounous cache invalidation](https://background-jobs.arcus-azure.net/features/security/auto-invalidate-secrets) to automatically invalidate cached Azure Key Vault secrets. 

## Plug & play

Our secret store is very easily to set up. All it requires is a single call to register the store `ConfigureSecretStore`, after that you can immediately use our `ISecretProvider` interface abstraction throughout your application.

```csharp
using Arcus.Security.Core;

[ApiController]
public class OrderController : ControllerBase
{
    private readonly ISecretProvider _secretStore;

    public OrderController(ISecretProvider secretStore)
    {
        _secretStore = secretStore;
    }

    [HttpGet]
    public async Task<IActionResult> Orders()
    {
        string secret = await _secretStore.GetRawSecretAsync("MySecret");
    }
}
```

We are very flexible in the registration of the secret providers. We allow all kinds of combinations and even multiple registrations of the same type. Imagine two Azure Key Vaults with public and user secrets.

```csharp
using Microsoft.Extensions.Hosting;

.ConfigureSecretStore((config, stores) =>
{
    stores.AddAzureKeyVaultWithManagedServiceIdentity("https://public-secrets.vault.azure.net")
          .AddAzureKeyVaultWithManagedServiceIdentity("https://user-secrets.vault.azure.net"); 
})
```

> Note that with our [named secret providers feature](https://security.arcus-azure.net/features/secret-store/named-secret-providers), you can retrieve a single secret provider instead of the combination. This can be useful in a scenario like this.

## Designed for security

Besides all the user-friendly features, there're also security reasons why the Arcus secret store is a recommended choice. We made sure that all the secret providers are registered in one single place and are being contacted via one single access point. This is much safer and easier to maintain then writing multiple service integrations yourself, scattered across the application. 

It's also safer than using the general [ASP.NET Core configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/) approach because we explicitly made the distinction between **data** and **secrets**. Many vulnerabilities gets introduced when secrets are seeen as data and are included in logs, for example. Leakage of sensitive information is a real risk in this case. Or when expired secrets doesn't get transient handling upon retrieval.

We also included [security events](https://security.arcus-azure.net/features/secret-store/#include-security-auditing) to our secret store to make sure that malicous activity can be detected more easily. These events are written every time the secret store is contacted.

With all the scecret-contacting functionality in one place, you're not only making your application more secure but decreasing the maintenance effort.

## Extensibility

A last section we can dedicate to the extensibility of the Arcus secret store. You can write your own secret providers, use [in-memory secret providers](https://github.com/arcus-azure/arcus.testing/blob/master/docs/features/inmemory-secret-provider.md) for testing purposes. We are also working hard to make sure that *all* built-in secret providers are completely overridable so you can bring your own version of the existing functionality. If that's not enough, you can also [mutate secret names](https://security.arcus-azure.net/features/secret-store/create-new-secret-provider#adding-secret-name-mutation-before-looking-up-secret) on-the-fly when they come into any secret provider.

Even the registration process of the secret store is adaptable. We have demonstrated this [here](https://www.codit.eu/blog/role-based-authorization-low-level-customization-arcus-secret-store/) where we introduced an extra layer of authorization that determined which user role gets to access which secret provider.

## Conclusion

We talked a lot about only *some* of the major features of the Arcus secret store. There are many [other advanced features](https://security.arcus-azure.net/features/secret-store/) that make this an even more useful tool in your future projects.

We hope that with this post, you're as excited as we are with the secret store.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.security/issues/new/choose).

Thank you for reading!
The Arcus team
