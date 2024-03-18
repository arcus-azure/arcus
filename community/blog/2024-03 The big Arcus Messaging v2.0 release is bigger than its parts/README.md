# The big Arcus Messaging v2.0 release is bigger than its parts
What the v2.0 brings to Arcus Messaging is the biggest collection of changes in years. Both the scope and type of changes bring a new way of messaging to projects.

## When downstream is unable to keep up
The registered message handlers are often interacting with an external system. This dependency system can not always follow the speed in which message are received and processed. If the system gets overwhelmed, the previous Arcus Messaging functionality did not take this into account.

Starting from v2.0, we introduce circuit breaker functionality that controls the message pump from your custom message handler. By injecting the `IMessagePumpCircuitBreaker`, any custom-implemented message handler is now in control of pausing the pump. By determining the health state of the dependency system, the message handler can determine whether or not the pump should be paused (ex. receiving  HTTP 503 Unavailable).

```csharp
using Arcus.Messaging.Abstractions.ServiceBus.MessageHandling;
using Arcus.Messaging.Pumps.Abstractions.Resiliency;

public class OrderMessageHandler : IAzureServiceBusMessageHandler<Order>
{
    private readonly IMessagePumpCircuitBreaker _circuitBreaker;

    public OrderMessageHandler(IMessagePumpCircuitBreaker circuitBreaker)
    {
        _circuitBreaker = circuitBreaker;
    }

    public async Task ProcessMessageAsync(Order message, AzureServiceBusMessageContext messageContext, ...)
    {
        // Determine whether your dependent system is healthy...

        // If not, call the circuit breaker, processing will be halted temporarily.
        await _circuitBreaker.PauseMessageProcessingAsync(messageContext.JobId);
    }
}
```

After the initial pause, several single messages will be retried until the dependency system is back up. Any options on how long the pump should be paused and how long the retry interval should be between retries is configurable when calling overloads from the `Pause...` method.

See the [feature documentation](https://messaging.arcus-azure.net/Features/general-messaging) for more information on this functionality.

## Three changes that correct and improve message routing
Besides the big circuit breaker feature, we also have introduced three small changes with a big impact on message handling and message routing. 

### Consider faulty message handler as 'message handled'
When a message handler is chosen by the message router to handle the message, but the message handler throws an exception, the message router previously incorrectly decided that the message is 'not handled'. The responsibility of the message router stops when the message is sent to the message handler. After that, it is the job of the message handler developer to handle the message correctly.

### Limit scope of registered message handlers
Any registered message handlers are now scoped to a single message router or message pump. This was previously not the case as message handlers registered for an one pump could be used for another. Setting the scope makes silos of each group of registered message handlers, and gives a more logical message flow.

### Configure operation name of handled message request
When a message is received in the message router, the operation name of the tracked telemetry can now be set. This was previously not the case, which made tracked telemetry less useful and/or logical. Having this configuration in place provides a more clear understanding of what is being handled by the messaging system.

## .NET 8 support
One would almost forget that this major release also brings .NET 8 to the messaging library. It steps away from .NET Core, but still supports .NET 6 and .NET Standard 2.1. Just like the Web API update, the Messaging update is the beginning of introducing Arcus and .NET 8 to client projects. Next step will be to updating the project templates so that any new project is kickstarted with .NET 8.

## Conclusion
This post only touches on the very surface of what the v2.0 provides. A lot of additional features and changes are included in this major release. We do not use by default automatic Azure Service Bus topic subscription creation/deletion anymore, we added Managed Identity support to EventHubs message pumps, we included the Service Bus type in the request tracking, and many more.

Have a look at our [release notes](https://github.com/arcus-azure/arcus.messaging/releases/tag/v2.0.0) and [official documentation](https://messaging.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.messaging/issues/new/choose).
Thanks for reading!

The Arcus team

