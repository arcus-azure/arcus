# Announcing Arcus Templates

Recently we released v0.2.0 of the [Arcus.Templates](https://github.com/arcus-azure/arcus.templates/releases/tag/v0.2.0) project and is available on NuGet.
This library will boost development for new projects with option-in/out of commonly used functionality.

Take a look what theses templates have to offer!

## Web API Template

Version v0.1.0 only contained some basic functionality, exception handling, and an option to add a shared key authentication mechanism.
What version [v0.2.0](https://www.nuget.org/packages/Arcus.Templates.WebApi/) provides is a lot more than that! 

Here's what the default template contains without any additional configurations:

* [Exception middleware](https://webapi.arcus-azure.net/features/logging) to log unhandled exceptions thrown during request processing.
* Content negotiation that only supports `application/json`.
* OpenAPI docs generation and UI (only available locally).
* Provides basic health endpoint with [ASP.NET Core health checks](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-2.2) with [OpenAPI support](https://www.codit.eu/blog/documenting-asp-net-core-health-checks-with-openapi/).
* Docker building file.
* Default console logger.

Besides that, we have provided a whole range of additional functionality that can be optioned-in/out during the creation of the template:

* We improved the authentication in our API by adding [JWT](https://webapi.arcus-azure.net/features/security/auth/certificate) and [client certificate](https://webapi.arcus-azure.net/features/security/auth/certificate) authentication.
* The template now allows you to include a `appsettings.json` file in the project.
* [Correlation](https://webapi.arcus-azure.net/features/correlation) between HTTP requests/responses is by default included in the project but can be option-out.
* The project includes [ASP.NET OpenAPI docs generation and UI](https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-swashbuckle?view=aspnetcore-3.1&tabs=visual-studio) by default but can be excluded.
* The logging capabilities are also expanded by adding a default console and [Serilog](https://serilog.net/) option.

For more info see the [docs](https://templates.arcus-azure.net/features/web-api-template).

## Azure Service Bus Queue/Topic Templates

As of v0.2.0, we've introduced two new templates for creating .NET workers a [message pump](https://messaging.arcus-azure.net/features/message-pumps/service-bus) that is either listening on a Azure Service Bus Queue or Topic.

Both templates are available on NuGet - [Queue message pump template](https://www.nuget.org/packages/Arcus.Templates.ServiceBus.Queue/) & [Topic message pump template](https://www.nuget.org/packages/Arcus.Templates.ServiceBus.Topic/).

Here's what default available in the template without any additional configurations:

* TCP health check probe ([official docs](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-2.2) & [Arcus docs](https://messaging.arcus-azure.net/features/tcp-health-probe)).
* Empty message pump on Azure Service Bus Queue or Topic ([official docs](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues))
* Dockerfile.

Besides that, each template provides an option to exclude the [Serilog](https://serilog.net/) logging infrastructure in the worker project.

For more info on the Azure Service Bus Queue template, see the [docs](https://templates.arcus-azure.net/features/servicebus-queue-worker-template).
For more info on the Azure Serivce Bus Topic template, see the [docs](https://templates.arcus-azure.net/features/servicebus-topic-worker-template).
