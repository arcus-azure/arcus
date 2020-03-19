# Announcing Arcus Messaging & Background Jobs

At Codit, we have been doing messaging since the company has started - Initially by using Microsoft BizTalk Server but over time we've been writing apps built on messaging in Azure as well.

We've seen that for a lot of customers we have to write the same boilerplate for processing message queues over and over again and it is not a trivial thing to do.

That's why we've decided to use our experience and start Arcus Messaging and Arcus Background Jobs which provides all of the boilerplate allowing you to focus on the application that you are building!

Recently we released v0.1.0 of the [`Arcus.Messaging`](https://github.com/arcus-azure/arcus.messaging/releases/tag/v0.1.0) and [`Arcus.BackgroundJobs`](https://github.com/arcus-azure/arcus.backgroundjobs/releases/tag/v0.1.0) and are now available on NuGet.
Both help with writing repeating jobs that securely receive external events and process them any way you want.

Come and take a look at what they have to offer!

## Receiving Messages From Azure Service Bus Queues & Topics

With Arcus Messaging we make it easier to process messages. By using a **message pump**, we will automatically get messages from a broker where we support Azure Service Bus for now.
This pump can be registered very easily on startup of your application and provides exception handling, deserialization, telemetry and more.

Once registered, one or more **message handlers** can be plugged in who will process messages. 
Based on the message type, the pump will send the message to the correct registered handler.
This allows a loosely coupled system between receiving and processing.

By using our [`Arcus.Messaging.Pumps.ServiceBus`](https://www.nuget.org/packages/Arcus.Messaging.Pumps.ServiceBus/) NuGet package, you can configure such a pump during startup.
See the following section as an example to handle `Order` messages with a custom `OrdersMessageHandler` implementation. 

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddServiceBusQueueMessagePump((ISecretProvider secretProvider) => secretProvider.GetRawSecretAsync("ServiceBus:Queue:ConnectionString"))
            .WithServiceBusMessageHandler<OrdersMessageHandler, Order>();
}
```

Where the your `OrderMessageHandler` will process the `Order` messages received on the Azure Service Bus Queue:

```csharp
public class OrdersMessageHandler : IMessageHandler<Order>
{
    private readonly ILogger _logger;

    public OrdersMessageHandler(ILogger<OrdersMessageHandler> logger)
    {
        _logger = logger
    }

    public async Task ProcessMessageAsync(
        Order message, 
        MessageContext messageContext, 
        MessageCorrelationInfo correlationInfo, 
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing order {OrderId} for {OrderAmount} units of {OrderArticle} bought by {CustomerFirstName} {CustomerLastName}", 
            order.Id, order.Amount, order.ArticleNumber, order.Customer.FirstName, order.Customer.LastName);
    }
}
```

See the [docs](https://messaging.arcus-azure.net/features/message-pumps/service-bus) for more info.

## Monitoring Health of a Worker

With Arcus Messaging we provide provide the capability to expose a TCP health probe endpoint that allows processes to periodically check the liveness/readiness of the application which is extremely important in container workloads.

This allows you to expose a health endpoint without having to include the HTTP stack in your workers, keeping your application simple.
Instead of reinventing the wheel, we've decided to build upon the built-in [.NET Core Health Checks](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-3.1) which allows us to integrate with existing tooling and leveraging a very compatible system.

By using our [`Arcus.Messaging.Health`](https://www.nuget.org/packages/Arcus.Messaging.Health/) NuGet package, you can very easily opt-in to expose the TCP endpoint:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddHealthChecks();
    services.AddAzureBlobStorage("UseDevelopmentStorage=true", "arcusblobs");
    services.AddTcpHealthProbes("Health:Tcp:Port");
}
```

See the [docs](https://messaging.arcus-azure.net/features/tcp-health-probe) for more info.

## Automatically Invalidate Azure Key Vault Secrets

With Arcus Background Jobs we provide capabilities for running a background job that automatically invalidates Key Vault secrets based on Azure Event Grid events emitted by the vault.
By adding this job to you application, it makes sure that your [cached secret providers](https://security.arcus-azure.net/features/secrets/general) in your application are always evicting the cache to use the most recent secrets.

By using our [`Arcus.BackgroundJobs.KeyVault`](https://www.nuget.org/packages/Arcus.BackgroundJobs.KeyVault/) NuGet package, you can very easily opt-in to automatically invalidate Azure Key Vault secrets:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddAutoInvalidateKeyVaultSecretBackgroundJob(
        "MyServiceBusTopicPrefix", 
        "ServiceBus:Topic:ConnectionString");
}
```

See the [docs](https://background-jobs.arcus-azure.net/features/security/auto-invalidate-secrets) for more info.
