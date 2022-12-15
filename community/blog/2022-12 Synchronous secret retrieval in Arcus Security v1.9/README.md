# Synchronous secret retrieval in Arcus Security v1.9
In some cases, an asynchronous is missing. This causes a bit of friction that the newest Arcus Security release has fixed with minimal change to your code base.

## The problem with asynchronous-only secret retrieval
The Arcus secret store is a very reliable and well-used functionality. It provides an alternative to storing sensitive secrets together with public application configuration values ([learn more about why this is important](https://www.codit.eu/blog/introducing-secret-store-net-core/)). Throughout the following releases, the secret store has grown in functionality and usability. It supports caching, secret versions, and lets you retrieve a single secret provider by name and is fully extensible. But there was a piece missing in this structure, and that is synchronous secret retrieval.

When using the secret providers, you can easily use them in asynchronous contexts like an API controller or upon each service method call. The problem happens, though, when you want to register a service in the dependency container. If that service needs to be initialized upon creation, you need the secret at creation time. Dependency containers usually do not work with asynchronous registration ([the one from Microsoft does not](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines#recommendations)).

The following workaround usually happens when the Arcus secret store is used in such scenarios:
```csharp
using Microsoft.Extensions.DependencyInjection;
using Arcus.Security.Core;

public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton(serviceProvider =>
    {
        var secretProvider = serviceProvider.GetRequiredService<ISecretProvider>();
        string secretValue = secretProvider.GetRawSecretAsync("MySecret").GetAwaiter().GetResult();

        return new MyServiceThatRequiresSecretRightAway(secretValue);
    });
}
```

## The solution of sync-support secret providers
What we did in Arcus Security v1.9, is something that is both simple and very powerful - and without any breaking changes. We introduced a new `ISyncSecretProvider` interface that inherits from our main `ISecretProvider` interface. This means that every synchronous secret provider is also an asynchronous secret provider. The transition from sync to async is a lot more straightforward than the way around. After that, we checked our available built-in secret providers and used the synchronous version on each one that could support synchronous secret retrieval. This includes Azure Key Vault, environment variables, configuration, User Secrets, Docker Secrets and others.

The second thing we did was to provide an extension on the `ISecretProvider` that lets you access synchronous secret retrieval variants without the need to inject the `ISyncSecretProvider`. This removes the need to know about the synchronous interface in the first place and contact the secret store like before.

Our sample now looks like this:
```csharp
using Microsoft.Extensions.DependencyInjection;
using Arcus.Security.Core;

public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton(serviceProvider =>
    {
        var secretProvider = serviceProvider.GetRequiredService<ISecretProvider>();
        string secretValue = secretProvider.GetRawSecret("MySecret");

        return new MyServiceThatRequiresSecretRightAway(secretValue);
    });
}
```

Note that we still use the `ISecretProvider` and do not need to add any other type of method.
✨ Like magic, all your code now supports synchronous secret retrieval.

## Implementing your own synchronous secret provider
The Arcus secret store was from its inception very flexible and extensible and that is also why we made a new interface in the same way we have the `ICachedSecretProvider` and `IVersionedSecretProvider`. This lets consumers choose if they want their secret provider to support synchronous secret retrieval or not. If not, then the secret store will either check for a different registration that does support it or throw a `NotSupportedException` if none does.

Implementing a secret provider that does check the Windows Registry for secrets could look like this:
```csharp
using Arcus.Security.Core;
using Microsoft.Win32;

public class RegistrySecretProvider : ISyncSecretProvider
{
    public Secret GetSecret(string secretName)
    {
        string secretValue = GetRawSecret(secretName);
        return new Secret(secretValue);
    }

    public string GetRawSecret(string secretName)
    {
        object value = Registry.LocalMachine.GetValue(secretName);
        return value?.ToString();
    }

    public Task<string> GetRawSecretAsync(string secretName)
    {
        string secretValue = GetRawSecret(secretName);
        return Task.FromResult(secretValue);
    }

    public Task<Secret> GetSecretAsync(string secretName)
    {
        string secretValue = GetRawSecret(secretName);
        return Task.FromResult(new Secret(secretValue));
    }
}
```

For more information about creating your custom secret provider, see [our official documentation](https://security.arcus-azure.net/Features/secret-store/create-new-secret-provider).

## Conclusion
Adding synchronous secret retrieval to the Arcus secret store was not only a much-needed but also the one true missing link for people that still store secrets in the application configuration. The `IConfiguration` only has synchronous operations, which makes the transition toward the Arcus secret store a little bit cumbersome. Now that this feature is available, we can say that we with Arcus support a fully working alternative that provides security and flexibility to your application.

For more information about the secret store, see [our official documentation](https://security.arcus-azure.net/features/secret-store). If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.security/issues/new/choose).

Thank you for reading!
The Arcus team