# 2021, the Year Arcus Matured
And here we are again. A year has passed and a lot of changes have been made on the Arcus front. This post will summarize the biggest changes that have been made in the year 2021.

2021 was an impactfull year for Arcus. In every repository major changes were made. This resulted in full production-ready open-source libraries that are ready to be used within your projects.

## Web API
The [Web API repository](https://github.com/arcus-azure/arcus.webapi) has probably got the most releases this year. Lots of changes have been made on almost all available functionality. Too many to name them all.
The most important, and seemingly most-used feature of this library is the request tracking. This feature has also had some major updates:

* Capability to omit entire endpoint routes from the request tracking
* Capability to only track requests with a certain HTTP status code response
* Capability to include/exclude request/response bodies from the telemetry

These changes are all available as general options and operation-specific attributes.
An example:

```csharp
using Arcus.WebApi.Logging;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/v1/order")]
public class OrderController
{
    [HttpPost]
    [RequestTracking(Exclude.RequestBody)]
    public IActionResult Post([FromBody] Order order)
    {
        // Handle big request body, too big to track it...
    }
}


[ApiController]
[Route("/api/v1/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [RequestTracking(500, 599)]
    public IActionResult Get()
    {
        // Determine health status, only failures (5xx status codes) will be tracked...
    }
}
```

[Another blog post](https://www.codit.eu/blog/enhanced-request-tracking-in-arcus-web-api-v1-3/) has been written on this topic of advanced request tracking.
For more information, see the [request tracking feature docs](https://webapi.arcus-azure.net/features/logging#logging-incoming-requests).

## Security
One of our most popular repositories, is the [security repository](https://github.com/arcus-azure/arcus.security), and the most-used feature would be the secret store. 2021 is the year that the secret store grew from an initial concept to a fully-usable feature that brings security by-default in your project. Following major features have been added:

* Capability to mutate the secret name before looking it up
* Capability to retrieve one or many secret providers with a registered name
* Capability to register critical exceptions to halt the secret-retrieval
* Capability to opt-in for security events
* Capability to track dependencies from built-in secret providers

Besides that, we also have added some new built-in secret providers:
* HashiCorp
* Docker secrets
* Command line arguments

[Another blog post](https://www.codit.eu/blog/secret-store-arcus-security-v1-4/) has been written on the updates of the secret store.

## Messaging
The biggest change that happened in the [messaging repository](https://github.com/arcus-azure/arcus.messaging), is the release of v1.0 and with it the major refactoring we passed through. The messaging library has a great feature to register message handlers that will handle incoming messages from a message pump. This message pump will receive its messages from an Azure Service Bus topic or queue. This split in message pump <> message handler is a great way to express the business logic in a comfortable and descriptive manner. What v1.0 introduced, is to make sure that this message handler system can be used outside a message pump. We extracted the message routing from the message pump, so the consumer can determine when a message can go through the message handling system. This is a great way if you already have received a message (without a message pump) but still want to make use of the amazing message handling system.

Our goal for the next year, is to make the message handling available for Azure Functions so it would look like this:

```csharp
using Arcus.Messaging.Abstractions;
using Arcus.Messaging.Abstractions.ServiceBus;
using Arcus.Messaging.Abstractions.ServiceBus.MessageHandling;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.ServiceBus;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

public class OrderProcessingFunction
{
    private readonly IAzureServiceBusMessageRouter _messageRouter;
    private readonly string _jobId;

    public OrderProcessingFunction(IAzureServiceBusMessageRouter messageRouter)
    {
        _messageRouter = messageRouter;
        _jobId = Guid.NewGuid().ToString();
    }

    [FunctionName("order-processing")]
    public async Task Run(
        [ServiceBusTrigger("docker-az-func-queue", Connection = "ARCUS_SERVICEBUS_CONNECTIONSTRING")] ServiceBusReceivedMessage message,
        ILogger log,
        CancellationToken cancellationToken)
    {
        log.LogInformation($"C# ServiceBus queue trigger function processed message: {message.MessageId}");

        AzureServiceBusMessageContext context = message.GetMessageContext(_jobId);
        MessageCorrelationInfo correlationInfo = message.GetCorrelationInfo();

        await _messageRouter.RouteMessageAsync(message, context, correlationInfo, cancellationToken);
    }
}
```

[Another blog post](https://www.codit.eu/blog/taking-messaging-to-the-next-level-with-arcus-messaging-v1-0/) has been written on this major change.
See our [features docs](https://messaging.arcus-azure.net/) for more information on our available functionality.

## Observability
The most important 2021 changes in the [observability repository](https://github.com/arcus-azure/arcus.observability) are all related to our upcoming [service-to-service correlation](https://github.com/arcus-azure/arcus.observability/issues?q=is%3Aissue+is%3Aopen+label%3Aservice-to-service-correlation) functionality. This feature would allow us to link requests across components in Azure Application Insights. Naturally, this is quite a big and complex adaptation so we choose to split the functionality in separate tasks.

The changes that were made this year on this, are:
* Capability to add operation parent ID to correlation information
* Capability to add dependency name to dependency telemetry

Besides those changes, we are working hard to make it even more production worthy. It's a popular and very important library to have mature telemetry in your project.
* Capability to track Azure Key Vault dependencies
* Capability to use telemetry type filter outside Arcus-related Serilog sink
* Capability to add public exception properties to exception telemetry

See our [features docs](https://observability.arcus-azure.net/) for more information on our available functionality.

## Templates
The [templates repository](https://github.com/arcus-azure/arcus.templates) is probably the easiest place to get started with Arcus. It provides development-ready project templates for you to use at the start of your project. It already contains all the necessary best-practices and correct use of Arcus libraries so you don't have to worry about infrastructure code but can focus on the business end.

2021 was the year that we took this to another level and created project templates for Azure Functions.
* Capability to create Azure Functions project with a HTTP endpoint trigger 
* Capability to create Azure Functions project running a timer to log finished Databricks log runs

There are already several project options and additional built-in functionality available for these new and existing project templates, so to make them more development-ready:
* Capability to opt-in for health checks
* Capability to track only 5xx requests in health endpoint
* Capability to configure minimum Serilog logging level from application settings
* Capability to use .NET project templates directly from Visual Studio 

When the [messaging library](https://github.com/arcus-azure/arcus.messaging) is ready to provide the message routing outside message pumps, we will create additional Azure Functions project templates with Azure Service Bus triggers. 
See our [feature docs](https://templates.arcus-azure.net/) for more information on our available functionality.

## Background Jobs
We also have a new scheduled job in the [background jobs repository](https://github.com/arcus-azure/arcus.backgroundjobs). We already had a job that would notify us when an Azure Key Vault secret was expired, but now we also are able to notify consumers when a Service Principal client secrets is about to expire or is expired.

This is a great way to keep track of your available client secrets. An Azure Event Grid event will notify you with all the details (secret name, expiration date). This library has already shown it's added-value by providing low-level infrastructure code that takes care of missing links between services.

See our [feature docs](https://background-jobs.arcus-azure.net/) for more information on our available functionality.

## Scripting
The [scripting repository](https://github.com/arcus-azure/arcus.scripting) has received various updates. From Azure API Management to Azure SQL databases to Azure DevOps integrations. This repository has always been a place where many things come together. Repeated tasks in CI build pipelines or local development, for example. The library was used more this year, which lead to great new ideas and functionality:
* Capability to upload private/public certificate to Azure API Management
* Capability to upload schema's/maps (transformations) into Azure Integration Account
* Capability to run SQL migration with semantic versioning
* Capability to retain an Azure DevOps build indefinitely
* Capability to upload files to Azure Blob Storage
* Capability to enable/disable Azure Logic App with/without configuration file
* ...

The new features are too many to list them all here. Take a look at our [feature docs](https://scripting.arcus-azure.net/) to get familiar with our available functionality.

## Conclusion, What's on the Horizon?
2021 was a big year for Arcus. A lot has changed. New features were introduced, existing ones were updated. It was a year where Arcus was more used than before. Consumers contributed with ideas and issues which made the code and available functionality stronger.

What's on the horizon? What brings 2022? At the end of this year, 3 new code-owners were introduced to Arcus. This will be a new milestone for the Arcus initiative. More opinions and viewpoints will for sure make these libraries better and more usable. 

Following features are on the horizon for 2022:
* Message routing extraction in the [messaging repository](https://github.com/arcus-azure/arcus.messaging)
* Azure Functions project templates for Azure Service Bus with message routing in the [templates repository](https://github.com/arcus-azure/arcus.templates)
* Service-to-service correlation in the [observability repository](https://github.com/arcus-azure/arcus.observability)
* And many more...

As always, thanks for reading and if you have any ideas, issues, problems, or just want to discuss something, don't hesitate to take a look at any of our [Arcus repositories](https://github.com/arcus-azure).
We're happy to have you.

Stijn
