# Rethinking event publishing in Arcus EventGrid v3.3
The Arcus EventGrid v3.3 release brings event publishing to a whole new level. It both simplifies and enhances the whole process into something very powerful. Keep reading to find out why. 

## Moving towards new Azure SDK
The v3.3 release steps away from defining our very own event publishing contract. Previously, we used an `IEventGridPublisher` interface and builder to create an instance of this interface. This instance could be injected into all the parts of your system that needed event publishing. We used it ourselves when we needed to publish events based on potential expired client secrets. There is, however, a problem here that only recently became a huge one: Microsoft's [`EventGridPublisherClient`](https://www.nuget.org/packages/Azure.Messaging.EventGrid/) does exactly that. With the dependency injection-supported Azure clients, you could inject such a client and publish events without Arcus. This is what software is about, something new comes up and everything changes.

We decided to deprecate our own event publishing functionality in favor of using Microsoft's; but we didn't stop there. The problem with Microsoft's version is that it depends on authentication keys stored in the application configuration ([and we know that is not okay](https://www.codit.eu/blog/introducing-secret-store-net-core/)). This created an opportunity for us.

Starting from Arcus EventGrid v3.3, there exists a new project called `Arcus.EventGrid.Core` which extends Microsoft's `EventGridPublisherClient` registration by making use of our Arcus secret store. Authentication keys could then be stored like any other secret and the registration just got simpler.

```csharp
using Microsoft.Extensions.DependencyInjection;

public void ConfigureServices(IServiceCollection services)
{
    // Requires Arcus secret store if not using managed identity, for more information, see: https://security.arcus-azure.net/features/secret-store
    services.AddSecretStore(stores => ...);

    // Registers an `EventGridPublisherClient` to your application to a custom topic.
    services.AddAzureClients(clients =>
    {
        clients.AddEventGridPublisherClient(
            // Custom Azure Even Grid topic endpoint:
            "https://my-eventgrid-topic-endpoint", 
            // Secret name where the authentication key to interact with Azure Event Grid is stored in the Arcus secret store.
            "<my-authentication-secret-name>");
    });
}
```

Event publishing happens the same way as before. With Azure clients, you can inject such a publisher instance with ease.

```csharp
using Azure.Messaging.EventGrid;
using Microsoft.Extensions.Azure;

public class MyService
{
    public MyService(IAzureClientFactory<EventGridPublisherClient> clientFactory)
    {
        EventGridPublisherClient client = clientFactory.CreateClient("Default");

        client.SendEventAsync(new CloudEvent(...));

        client.SendEventAsync(new EventGridEvent(...));

        // And other overloads...
    }
}
```

Look out for [more information about event publishing](https://eventgrid.arcus-azure.net/Features/publishing-events) and the [Arcus secret store](https://security.arcus-azure.net/features/secret-store).

## Moving towards W3C correlation
When implementing service-to-service correlation across our Arcus components, we used a hierarchical approach. This approach is deprecated which means that we will have to move towards a new way of correlation. W3C is the way forward. The interesting thing about Microsoft's event publishing and event subscribing system is that it does not come with an automatic service-to-service correlation like other components. This means that Arcus can be a real added value here.

In v3.3 we made sure that the registered event publisher uses the new W3C correlation and that with a single `traceparent` [custom delivery property](https://learn.microsoft.com/en-us/azure/event-grid/delivery-properties), you could make sure that the event subscriber is correlated to the event publisher. When an event is published and sent toward an Azure Service Bus instance, for example, then Azure Application Insights will make this parent-child relationship visible in the transaction overview.

🚩 Note that the event publisher needs an Arcus correlation implementation. Use [Arcus HTTP correlation](https://webapi.arcus-azure.net/features/correlation), [Arcus Messaging built-in correlation](https://messaging.arcus-azure.net/Features/message-handling/service-bus) or [implement your own](https://observability.arcus-azure.net/Features/correlation).

Look out for [more information about event publishing](https://eventgrid.arcus-azure.net/Features/publishing-events) where we discuss how you can add such a custom delivery property and how this works with other event subscribers.

## Managed identity authentication support
But that is not all. v3.3 does not only contain a whole new way of event publishing and event correlation, but we also made sure that you can now more easily register such an event publisher with the recommended managed identity authentication system.

Using managed identity during the event publisher registration only requires a topic endpoint, making it not only the most recommended but the easiest way to register event publishers:
```csharp
using Microsoft.Extensions.DependencyInjection;

public void ConfigureServices(IServiceCollection services)
{
    // Registers an `EventGridPublisherClient` to your application to a custom topic.
    services.AddAzureClients(clients =>
    {
        clients.AddEventGridPublisherClientUsingManagedIdentity(
            // Custom Azure Even Grid topic endpoint:
            "https://my-eventgrid-topic-endpoint");
    });
}
```

## Conclusion
Arcus EventGrid v3.3 is packed with tons of new ways to do event publishing in your application. It is built on top of the new Azure SDK, is adapted to use the newest W3C correlation standard and lets you manage authentication with managed identity. Together this brings real added value to your project by hiding the complexity behind easy-to-use systems and still providing you with the familiar Microsoft tools.

See [our official documentation](https://eventgrid.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.eventgrid/issues/new/choose).

Thanks for reading!
-Arcus team