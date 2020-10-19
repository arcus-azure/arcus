# Introducing message handling with Azure Service Bus message influence in v0.5

Starting from v0.4 and updated in v0.5, the [Arcus.Messaging](https://github.com/arcus-azure/arcus.messaging) has got an upgrade in handling messages from Azure Service Bus.
Previous versions already had set up a message handling system where messages could be routed and processed according to contextual information, but the system wasn't yet mature enough that it provided a way to report back to Azure when the message processing was completed.

Until now.

## Azure Service Bus message operations

Currently, we provide three specific Azure Service Bus functions:
- **Completing** a message which marks the Service Bus message 'complete' on Azure so no other queue can process it again (this is normally done automatically but can be turned off so you're in full control).
- **Dead lettering** a message which marks the Service Bus message 'dead lettered' on Azure so it's moved to the dead letter queue.
- **Abandoning** a message which marks the Service Bus message 'abandonned' on Azure.

## Specific Azure Service Bus message handlers

Because of the way the message handlers are registered and used inside the application, there's no 'callback' function to access the Azure Service Bus.
That's why we've created two 'message handler templates' to help with this. These templates implements the message handler signature but also provides you with a whole range of specific Azure Service Bus functions that are related to completing the message processing.

- `AzureServiceBusMessageHandler<>`: is an `IMessageHandler` implementation which provides the specific Azure Service Bus message operations
- `AzureServiceBusFallbackMessageHandler`: is an `IServiceBusFallbackMessageHandler` implementation which provides the specific Azure Service Bus message operations

### Regular message handling

Here is an example of how a normal `IMessageHandler` implementation is created for Azure Service Bus.
The `IAzureServiceBusMessageHanlder<>` is used here as shortcut, which in fact implemnets the `IMessageHandler<>`.

```csharp
public class OrderMessageHandler<Order> : IAzureServiceBusMessageHandler<Order>
{
    public async Task ProcessMessageAsync(Order order, AzureServiceBusMessageContext context, ...)
    {
        // Processing order.
    }
}
```

When you decide you want to abandon the message when the order is not recognized or the message context is invalid, you'll have to implement `AzureServiceBusMessageHandler<>` instead.

```csharp
public class OrderMessageHandler<Order> : AzureServiceBusMessageHandler<Order>
{
    public override async Task ProcessMessageAsync(Order order, AzureServiceBusMessageContext context, ...)
    {
        if (order.Customer is null)
        {
            // Calling base operation where the Azure Service Bus operations are located.
            await base.AbandonMessageAsync();
        }
        else
        {
            // Processing order.
        }
    }
}
```

Note that in the regular message handling you don't have to specify which message to abandon. This is all done behind the screens so the message handler only has to focus on the message processing and call the specific Azure Service Bus message operations when necessary.

### Fallback message handling

The fallback message handling is possible more correct when we're talking about dead lettering a message. Fallback message handlers will process the Azure Service Bus message when none other regular message handler was able to correctly process it.
At the end of the fallback message processing, the message could be dead lettered on Azure for example.

Here's an example of how a normal `IServiceBusFallbackMessageHandler` is implemented:

```csharp
public class OrderFallbackMessageHandler : IAzureServiceBusFallbackMessageHandler
{
    public async Task ProcessMessageAsync(Message orderMessage, AzureServiceBusMessageContext context, ...)
    {
        // Processing order.
    }
}
```

When you decide you want to dead letter the message, you'll have to implement  `AzureServiceBusFallbackMessageHandler` instead.

```csharp
public class OrderFallbackMessageHandler : AzureServiceFallbackMessageHandler
{
    public override async Task ProcessMessageAsync(Message orderMessage, AzureServiceBusMessageContext context, ...)
    {
        // Processing order.
        await base.DeadLetterAsync(orderMessage);
    }
}
```

Note that because the fallback message handlers have more control over the original Azure Service Bus message, they will have to pass along the message to the base operations.

## Is that all?

No, of course not. The v0.4 and v0.5 version also has some minor updates regarding less verbose logging and some extra correlation extensions to pass along your own custom operation/transation ID property. All are helping in making the developer and consumer more in control of our messaging functionality.

## What's on the horizon?

We'll see how we can reuse our message handling system in the context of Azure functions where the function binding will replace the message pump.
We'll also look at how we can let the consumer be more in control of how the incoming Azure Service Bus messages are being deserialized before they're passed to the message handling.

Have a question, remark, feedback or idea for a superduper addition?
Feel free to take a look at our [GitHub repository](https://github.com/arcus-azure/arcus.messaging) and [create an issue](https://github.com/arcus-azure/arcus/issues/new/choose).

Thank you very much for reading and happy messaging!

Arcus Team
