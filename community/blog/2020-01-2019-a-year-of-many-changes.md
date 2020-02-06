# 2019, A Year of Many Changes

Last year, we made a whole diversity of changes in all GitHub Arcus repositories and even made some new ones. It was a year of making the existing 'basic' functionality future-proof and more extensive so new projects _really_ benefit from it.

Come and take a look at what we've done in the Arcus factory!

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

An upcoming, new, GitHub repository is in the working called [`Arcus.Messaging`](https://github.com/arcus-azure/Arcus.Messaging) where we will store functionality for 'messaging' runtime components.

...
