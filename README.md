[![Netlify Status](https://api.netlify.com/api/v1/badges/a94cac62-0d30-4d52-a378-d60cc1717db9/deploy-status)](https://app.netlify.com/sites/arcus-staging/deploys)

# Arcus
Azure development in a breeze.

![Arcus](./media/arcus.png)

## Issues & Feature Requests
We track issues in a variety of places for Arcus. If you have found an issue or have a feature request, please submit an issue to the below repositories.

| Area           | Description                                             | Link                   |
|:---------------|:--------------------------------------------------------|:----------------------:|
| **General**    | General request or suggestions for new areas            | [File an Issue](https://github.com/arcus-azure/arcus/issues) |
| **Event Grid** | Requests & suggestions for Azure Event Grid integration | [Features](https://eventgrid.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.eventgrid/issues)
| **Event Grid Sidecar** | Requests & suggestions for Azure Event Grid Docker container | [Features](https://eventgrid-sidecar.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.eventgrid.sidecar/issues)
| **Security** | Requests & suggestions for security integration(s) | [Features](https://security.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.security/issues)
| **Web API** | Requests & suggestions for web api development | [Features](https://webapi.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.webapi/issues)
| **Messaging** | Requests & suggestions for messaging development | [Features](https://messaging.arcus-azure.net/#features) - [File an Issue](https://https://github.com/arcus-azure/arcus.messaging/issues)
| **Background Jobs** | Requests & suggestions for reusable jobs & development of background jobs | [Features](https://background-jobs.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.backgroundjobs/issues)
| **Observability** | Requests & suggestions for adding observability to applications | [Features](https://observability.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.observability/issues)
| **.NET Templates** | Requests & suggestions for .NET templates to get started | [Features](https://templates.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.templates/issues)
| **Machine Learning** | Requests & suggestions for machine learning in Azure | [Features](https://machine-learning.arcus-azure.net/#features) - [File an Issue](https://github.com/arcus-azure/arcus.azureml/issues)

 ## Starting a new components
 
 Every new Arcus component repo should be created via following flow:
 - Create a new repo based on our GitHub template which is located in [arcus-azure/arcus.template](https://github.com/arcus-azure/arcus.template).
   - We typically use the `arcus.{component-name}` naming convention
 - Run the [GitHub Repo Configurator
](https://github.com/arcus-azure/arcus/tree/master/tools/github-repo-configurator) to generate all default labels, issues and milestoned.
   - Add `arcus-automation` with Admin permissions to your new repo
   - Run the tool as `arcus-automation`
- Get started!

We have a variety of Azure DevOps YAML templates which you can re-use and are open for suggestion!

## Customers
Are you an Arcus user? Let us know and [get listed](https://bit.ly/become-a-listed-arcus-user)!

## Contributing
We are open for all contributions, learn more about our coding conventions in our ["Developer Guide"](DEVELOPER-GUIDE.md).
