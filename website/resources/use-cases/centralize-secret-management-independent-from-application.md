---
title: Centralize secret management independent from application
slug: centralize-secret-management-independent-from-application
order: 0
description: Differentiating between configuration data and secrets is critical for the security of applications. HTTP ports, application name... can all be seen as public data but access tokens, private keys... should not be in the same group.
components:
  - Arcus Security
---

# Centralize secret management independent from application

Differentiating between configuration data and secrets is critical for the security of applications. HTTP ports, application name... can all be seen as public data but access tokens, private keys... should not be in the same group. Accessing them in a centralized manner and secure manner is therefore important.

The [Arcus secret store](https://security.arcus-azure.net/features/secret-store) is the answer. The secret store will be the single point of truth in interacting with required secrets for your application. Multiple 'secret providers' can be configured that accesses the secrets from external sources like: Azure Key Vault, HashiCorp Vault, Docker secrets, environment variables... and the secret store will provide a single access point for the application to fetch those secrets.

An example of how to implement an Azure KeyVault and appsettings config file and how well the secret store integrates within an application:

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

A secret store reference can be injected into your application to retrieve back the secrets from your configured sources:

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

The Arcus secret store is by-default integrated in [all our .NET project templates](https://templates.arcus-azure.net/)!
For more information, see [our documentation site](https://security.arcus-azure.net/features/secret-store).

Blogs:

- [Introducing Arcus secret store - making secrets a first-class citizen](https://www.codit.eu/blog/introducing-secret-store-net-core/)
- [Advanced Arcus secret store features](https://www.codit.eu/blog/secret-store-arcus-security-v1-4/)
