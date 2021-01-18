# Making the secret store more powerful in Arcus.Security v1.4

Starting from [Arcus.Security v1.4](https://github.com/arcus-azure/arcus.security/releases/tag/v1.4.0), the secret store got a lot of new updates. In this post we'll run over some of the major updates.
This post will not contain all the new changes, so for more information see the [release notes](https://github.com/arcus-azure/arcus.security/releases/tag/v1.4.0) of this new version.

We also assume you are familiar with some of the concepts of Arcus, especially the secret store concept. If you are not, we recommend reading our [blog post](https://www.codit.eu/blog/introducing-secret-store-net-core/) that will guide you through concept and/or read our [official docs](https://security.arcus-azure.net/features/secret-store/).

## Secret name mutation

One of the most requested features shipped in this release is the mutation of secret names. When a secret is looked up in the Arcus secret store, the requested name is directly passed along to all the registered secret providers. The secret name mutation feature allows you to manipulate the secret name _before_ it's passed to the secret provider.

Imagine that you have two secret providers, the first one gets secrets from the `IConfiguration` (in Debug mode) and second from environment variables:

```csharp
Host.CreateDefaultBuilder()
    .ConfigureSecretStore((config, stores) =>
    {
        #if DEBUG
        stores.AddConfiguration(config);
        #endif

        stores.AddEnvironmentVariables();
    });
```

Values in the configuration are usually structed by using colons (ie. `Arcus:Secrets:MySecret`) while environment variables are mostly structured with capitals with underscores (ie. `ARCUS_SECRETS_MYSECRET`).
But when requesting the secret, I would want to use the same name to request the same secret (in this case `MySecret`). Let's say I want to use dots instead to requests secrets (as in `Arcus.Secrets.MySecret`). We can use the secret name mutation to _mutate_ the secret name to adhere the respectively secret provider's secret name scheme before it's passed allong:

```csharp
Host.CreateDefaultBuilder()
    .ConfigureSecretStore((config, stores) =>
    {
        #if DEBUG
        stores.AddConfiguration(config, secretName => secretName.Replace(".", ":"));
        #endif

        stores.AddEnvironmentVariables(secretName => secretName.Replace(".", "_").ToUpper());
    });
```

With these secret name mutations, we can call in `secretProvider.GetRawSecret("Arcus.Secrets.MySecret")` and it will correct the secret name so it matches the secret provider's scheme.

## Named secret providers

In certain scenarios, you want to retrieve a secret from a specific secret provider without trying every other registered provider first in case you already know the location of your secret.

In any case, you'll have to interact in a different way with the secret store. That's where this new feature comes into play.

Starting from v1.4 we allow secret providers to be registered with an unique name. This name will be used to later retrieve the provider so choose wisely. The environment variable secret provider can for example be registered with `"EnvironmentVariables"`:

```csharp
Host.CreateDefaultBuilder()
    .ConfigureSecretStore((config, stores) =>
    {
        stores.AddEnvironmentVariables(name: "EnvironmentVariables");
    });
```

Normally, you would now inject the `ISecretProvider` into your dependent services, but to retrieve a specific provider, you'll have to inject `ISecretStore`. This new interface is another abstraction layer to interact with the secret store. With the `.GetProvider` overloads, you can now retrieve the previously registered environment variables secret provider directly.

```csharp
[ApiController]
public class MyController : ControllerBase
{
    public MyController(ISecretStore secretStore)
    {
        // Gets seccret provider interface.
        ISecretProvider secretProvider = secretStore.GetProvider("EnvironmentVariables");

        // Get typed secret provider.
        var environmentVariablesSecretProvider = secretStore.GetProvider<EnvironmentVariablesSecretProvider>("EnvironmentVariables");
    }
}
```

> The v1.4 release also adds the possibility to store Azure Key Vault secrets with the Azure Key Vault secret provider. 
> The named secret provider feature allows you to retrieve the Azure Key Vault scret provider and use this storing functionality.

## Critical exceptions

In version v1.3, when a secret was retrieved from the secret store and some authentication problem occurred, the secret store would incorrectly fail with 'Secret not found' exceptions. The secret store was not yet smart enough to know that some failures would need to be bubbled up to the consumer instead of swallowed into general 'Secret not found' exceptions. This problem also occurs when consumers want to implement their own secret provider and want the possibility to fail with custom exceptions. Previously, any problem that occurred in the interal registered secret providers would be notified incorrectly as 'Secret not found'.

In the v1.4 release, we have fixed this problem by introducing the 'Critical exceptions' concept. This allows you to register certain exception types with or without certain predicates to determine of a thrown exception can be considered critical and should be notified to the end consumer. This functionality alows creates of secret providers to register their own custom exceptions when needed to be, and allows the existing secret providers to notify authentication problems while retrieving secrets.

See how these critical exceptions can be registered in the secret store:

```csharp
Host.CreateDefaultBuilder()
    .ConfigureSecretStore((config, stores) =>
    {
        // Means that every raised 'AuthenticationException' will be bubblded up to the end consumer.
        stores.AddCriticalException<AuthenticationException>();

        // Means that every raised 'HttpRequestException' with the 403 HTTP staus code will be bubbled up to the end consumer.
        stores.AddCriticalException<HttpRequestException>(exception => exception.StatusCode == HttpStatusCode.Forbidden);
    })
```

Note that our existing secret providers (Azure Key Vault, ...) already have been updated to include some critical exceptions. So when you register the Azure Key Vault or other built-in secret providers via `.AddAzureKyVault...` they will behind the scenes already add these exceptions. This is also a take-away when you develop your own secret provider and want with your provider register some exceptions that for your scenario should be considered critical.

## Leftovers

Besides these three major updates, we also have a lot of other stuff added to this release. Here are some take-aways:
* [**Opt-in for tracking security events**](https://security.arcus-azure.net/features/secret-store/): the secret store can now by default track every secret that is being retrieved by setting the `.WithAuditing` 
* [**HashiCorp**](https://security.arcus-azure.net/features/secret-store//provider/hashicorp-vault) and [**Docker secrets**](https://security.arcus-azure.net/features/secret-store/provider/docker-secrets) are made available as secret providers for the secret store.
* **Secret store** is now available outside the .NET Core hosting can be used in any project (also in [Azure Functions](https://security.arcus-azure.net/features/secret-store/#using-secret-store-within-azure-functions)) with a new extension on the `IServiceCollection`. 

## Conclusion

This new version allows users even more to use the Arcus secret store in real-life projects. It's a responsible concept that makes sure that we make a distinct separation between configuration and secret values. With all these new features, we hope that users are even more convinced to give our Arcus security library a go.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.security/issues/new/choose).
Thanks for reading!
