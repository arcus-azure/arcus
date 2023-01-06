# Integrating fully with Microsoft technology in Arcus Messaging v1.4
We have seen a whole new wave of changes in Arcus that only strengthens our relationship with Microsoft technology. The Arcus Messaging v1.4 release is no different.

## Built-in W3C correlation tracking on received messages
Microsoft uses internally the new W3C correlation technology to track connections between services. In short: this is possible by passing on a `traceparent` value that contains both the current transaction ID that is the same across the entire operation call, as well as the parent ID that identifies the sender. Microsoft uses this value when an HTTP request is made with the built-in `HttpClient`, when a message is placed on an Azure Service Bus queue, when a SQL command is executed, and any other Microsoft/Azure related technology.
Because of this default behavior, service-to-service correlation tracking with only Microsoft/Azure technology is immediately available in Application Insights.

Arcus was using in the past the Hierarchical correlation system which was not only deprecated but did not by default matches the W3C correlation that Microsoft uses. The new v1.4 release is changed completely in that regard. Now, W3C is the default which means that any message that comes from Azure Service Bus or Azure EventHubs will automatically get tracked without the sender needing to know about any Arcus technology on the sending side. This is a major improvement that provides real added value for projects. Arcus and Microsoft are now working seamlessly together.

⚡ Note that no code changes are required for this change on the receiving side. Only a minor update towards v1.4!

## Register Azure messaging clients with synchronous secret retrieval
Microsoft provides some easy extensions to register a `ServiceBusClient` and `EventHubsProducerClient` to your application services. The problem is that when you do not use managed identity, you have to provide the authentication access signature yourself (and if this uses the application configuration, [we know that is not okay](https://www.codit.eu/blog/introducing-secret-store-net-core/)). v1.4 includes some minor but powerful changes regarding Azure messaging client registrations so that the clients are using the [Arcus secret store](https://security.arcus-azure.net/features/secret-store) for their access signatures.

Only a secret name is required when registering your Azure messaging client, delegating the complexity of secret management easily to the secret store:
```csharp
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.DependencyInjection;

public class Program
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Adding Arcus secret store, more info: https://security.arcus-azure.net/features/secret-store
        services.AddSecretStore(stores => stores.AddAzureKeyVaultWithManagedIdentity("https://my.vault.azure.net");

        // Adding Service Bus client with secret in Arcus secret store.
        services.AddAzureClients(clients => clients.AddServiceBusClient(connectionStringSecretName: "<your-secret-name>"));
    }
}
```

This is also a great example of how Arcus and Microsoft work together. In the past, we each used our way of registering clients, but with changes like these we bridge the gap and strengthen each other.

For more information about this feature, see our dedicated feature documentation for [Service Bus](https://messaging.arcus-azure.net/Features/service-bus-extensions) and [EventHubs](https://messaging.arcus-azure.net/Features/event-hubs-extensions).

## Pause message pumps when the dependent downstream service can't keep up
This feature is not the first one that circles back to the message pump, but it is the first one that made it so easy to be used from within your message handler. In a perfect world, messages would be received by either a message pump/Azure Function and your implemented message handlers would handle them perfectly to any dependent downstream service. Unfortunately, this downstream service may work at a different speed than the speed at which messages are received. If the service works faster, then there may not be an immediate problem, but if the service works slower a rate problem could occur.

v1.4 fixes this problem by introducing an `IMessagePumpLifetime` service that is part of the application services and which any component can interact with. With a simple start/pause/stop functionality the consumer can now control when a message pump should hold off from receiving messages until the downstream service is ready again.

```csharp
using Microsoft.Extensions.DependencyInjection;
using Arcus.Messaging.Pumps.Abstractions;

public class Program
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddServiceBusMessagePump(..., options => options.JobId = "abc-123")
                .WithServiceBusMessageHandler<..., ...>();

        services.AddEventHubsMessagePump(..., options => options.JobId = "def-456")
                .WithEventHubsMessageHandler<..., ...>();
    }
}

public class RateLimitService
{
    private readonly IMessagePumpLifetime _pumpLifetime;

    public RateLimitService(IMessagePumpLifetime lifetime)
    {
        _pumpLifetime = lifetime;
    }

    public async Task CantKeepUpAnymoreAsync(CancellationToken cancellationToken)
    {
        var duration = TimeSpan.FromSeconds(30);
        await _pumpLifetime.PauseProcessingMessagesAsync("abc-123", duration, cancellationToken);
    }
}
```

This is a very practical feature that will hopefully help a lot of applications handle their service interactions.
For more information about this feature, see [our dedicated feature documentation](https://messaging.arcus-azure.net/Features/general-messaging).

## Conclusion
Arcus Messaging v1.4 is a big step towards a seamless incorporation with Microsoft technology. Our abstracted way of messaging proves to be a real beneficial value and if we can make sure that we reuse existing Microsoft technology, we only strengthen our bond.

Have a look at our [release notes](https://github.com/arcus-azure/arcus.messaging/releases/tag/v1.4.0) and [official documentation](https://messaging.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.messaging/issues/new/choose).
Thanks for reading!

The Arcus team