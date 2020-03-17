# Announcing Arcus Messaging & Background Jobs

Recently we released v0.1.0 of the [`Arcus.Messaging`](https://github.com/arcus-azure/arcus.messaging/releases/tag/v0.1.0) and [`Arcus.BackgroundJobs`](https://github.com/arcus-azure/arcus.backgroundjobs/releases/tag/v0.1.0) and are now available on NuGet.
Both help in in writing repeating jobs that securely receive external events and process them any way you want.

Come and take a look at what the basic features of these projects have to offer!

## Receiving Messages From Azure Service Bus Queues & Topics

The [`Arcus.Messaging.Pumps.ServiceBus`](https://www.nuget.org/packages/Arcus.Messaging.Pumps.ServiceBus/) package provides something that's called a **message pump** for messages on Azure Service Bus.
This pump can be registered very easily on startup of your application.

Once registered, one or more **message handlers** can be registered that will eventually process the message. 
Based on the message type, the pump will send the message to the correct registered handler.
This allows a loosely coupled system between receiving and processing.

See the [docs](https://messaging.arcus-azure.net/features/message-pumps/service-bus) for more info.

## Monitoring Health of a Worker

The [`Arcus.Messaging.Health`](https://www.nuget.org/packages/Arcus.Messaging.Health/) package provides the capability to expose a TCP probe health endpoint that allows a runtime to periodically check the liveness/readiness of the application.
Using the already known [.NET Core Health Checks](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-3.1), we provide a very compatible system in a worker project.

See the [docs](https://messaging.arcus-azure.net/features/tcp-health-probe) for more info.

## Automatically Invalidate Azure Key Vault Secrets

The [`Arcus.BackgroundJobs.KeyVault`](https://www.nuget.org/packages/Arcus.BackgroundJobs.KeyVault/) package provides capabilities for running a background job that automatically invalidates Key Vault secrets based on the send out Azure Event Grid Events on the vault.
Adding this job to you application makes sure the used [cached secret providers](https://security.arcus-azure.net/features/secrets/general) in your application are always updated with the most recent secrets.

See the [docs](https://background-jobs.arcus-azure.net/features/security/auto-invalidate-secrets) for more info.
