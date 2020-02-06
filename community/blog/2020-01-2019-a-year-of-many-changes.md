# 2019, A Year of Many Changes

In 2019 we've [announced **Arcus**](https://www.codit.eu/blog/announcing-arcus/), a set of open-source components that make it easier to build applications that run on Microsoft Azure.

Since then we've been working hard to provide more functionality, make it easier to use and even introduce new areas where we are investing in!

With Arcus we strive to reduce rewriting functionality that all our customers need so that we can focus on their business needs rather than infrastructure.

Come and take a look at what we've done on Arcus!

## YAML as New Build System

In every existing new and future GitHub repositories, we will use YAML as our primary build system. This includes also the running tests and publishing NuGet packages. This was a major change arcoss the Arcus landscape but was definitelly worth it.

We've also created a dedicated [`azure-devops-templates`](https://github.com/arcus-azure/azure-devops-templates) GitHub repository that contains reusable YAML templates. This reduces duplication, makes the structure of different parts of the build process central so we can quickly update _all_ Arcus repositories.

An example is: [**Running Integration Tests**](https://github.com/arcus-azure/azure-devops-templates/blob/master/test/run-integration-tests.yml), which includes both the replacement of configuration tokens for application settings, as well as the `dotnet` command to run the tests.

## Arcus.EventGrid

The GitHub [`Arcus.EventGrid`](https://github.com/arcus-azure/arcus.eventgrid) repository was already contained some 'basic' functionality to interact with Azure EventGrid resources.
Last year, we invested in both the sending- and receiving-side of EventGrid events.
By 'sending', we mean that we can now publish RAW events (without schema; raw JSON string) both as a single event and as a set of events using the `EventGridPublisher` as starting point.
With this new functionality, publishing events becomes super simple without worring about predefining the schema in a class.

The 'receiving' since also got an update. We now fully support 'CloudEvent' events using the offical .NET SDK. 
This means that the Arcus.EventGrid library can work with Azure EventGrid that are configured  with EventGrid events or CloudEvent events.

## Arcus.Security

The updates in the GitHub [`Arcus.Security`](https://github.com/arcus-azure/arcus.security) repository are most of all internal restructure-work and improvements for future upcoming features, such as:
how the security provider implementations are initialized, configured, how we replace configuration tokens with secrets...
Nonethless, some intresting things happend internally to improve usability and stability.
Client-throttling, for instance has been added to accompany HTTP `TooManyRequests` errors returned from Azure KeyVault.

How we authenticate with KeyVault has also received an update. 
We've added certificate-based authentication and Azure Active-Directory for Managed Identity authentication with a raw connection string support.

## Arcus.WebApi

Security and exceptions, those were the main topics where the major changes happend in the GitHub [`Arcus.WebApi`](https://github.com/arcus-azure/arcus.webapi) repository.
Because all API applications should have some type of 'global' exception handling functionality that handles 'unexpected' exceptions, we've created a middleware component that does this for us.
This component is default a _catch all_ exceptions and handles the HTTP responses for us; meaning we have less (but not nothing) to worry about forgotton exceptions.

As for the security aspect, we've added two approaches to do authentication in API applications: _Shared Access Key_ and _Certificate_ authentication.
Both approaches can be configured globally so the entire application requires authentication or more fine-grained on operation level, having more control about specific parts of your application.
Oh, and as bonus: in a separate library, we've added OAuth integration for security definitions with OpenApi extensions.

## Arcus.Templates

Probably the where the bigest changes are made, is the newly created GitHub [`Arcus.Templates`](https://github.com/arcus-azure/arcus.templates) repository.
This will be the home of different types of project templates so you can kickstart your new project.

Currently, a single project template is available that will create an web API application with already some commenly used, boilerplate code.
The exception handling middleware from the [`Arcus.WebApi`](https://github.com/arcus-azure/arcus.webapi) repository is, for example, by default present in the resulting project.
Just like a health check and logger.

But the most intresting part is the additional project options that are available. 
The newly added authentication mechanisms in the [`Arcus.WebApi`](https://github.com/arcus-azure/arcus.webapi) repository are also available here as project options. 
Adding `--authentication SharedAccessKey` to the CLI command is all that is required to correctly configure the authentication of your project.
Other project options have also been added like Swagger and application settings, and many more intreseting features are comming!

There is also another project template on the horizon that will create a .NET worker service project with TCP health probes and message pumps, so keep your eye on future work on Arcus!

## 2020, a Sneak Peak

And we are not stopping there!

On most of our projects we use queues to decouple processes and process the workload asynchronously. We've seen that we have to write message pumps over and over again where we have to manage the pump, provide exception handling, telemetry, deserialization and more but we are going to provide all of this out-of-the-box! This would allow you to focus on the processing of the messages and not how you get them.

More and more Azure services are starting to emit Event Grid events which allow us to automate processes. [Azure Key Vault is one of them](https://docs.microsoft.com/en-us/azure/event-grid/event-schema-key-vault) which notifies us about expiring certificates or secrets that are updated, we'll use this to automatically renew our cached secrets in a secure manner.

Last but not least, deploying your applications to production is only the beginning and not the end. That's why observability is crucial for building production-ready platforms so that operation team understands what's going on. However, developers tend to not care about that until it's too late.

Because of that we'll try to reduce the pain of providing good tracing, metrics, request logging, business event tracking and visual representation of the application by extending Serilog so that it works better with Azure Application Insights.

And who knows what we'll add next! Do you have a great idea? Don't hesitate to let us know in the comments or on GitHub!

Thanks for reading,

Stijn & Tom.
