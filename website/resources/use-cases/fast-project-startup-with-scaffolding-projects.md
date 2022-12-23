---
title: Fast project startup with scaffolding projects
slug: fast-project-startup-with-scaffolding-projects
order: 2
description: The start of each project has often the same kind of process before the actual implementation can be written. Boilerplate code, infrastructure setup. This can be a kind of tedious and repetitive process as most beginnings are the same.
components:
  - Arcus Templates
---

# Fast project startup with scaffolding projects

The start of each project has often the same kind of process before the actual implementation can be written. Boilerplate code, infrastructure setup. This can be a kind of tedious and repetitive process as most beginnings are the same.

[Arcus Templates]() is the answer. The library provides production-ready .NET project templates to faster start you of with the actual business implementation. They have several project options to fully customize how the end-result project should look like. Changing the authentication mechanism? Other logging framework? It's all possible with the project templates. You run the .NET command and you are good to go!

```shell
// Install the project template
PM > dotnet new --install Arcus.Templates.WebApi

// Create new project from the template
PM > dotnet new arcus-webapi --name Arcus.Demo.WebAPI
```

For more information, see [our documentation site](https://templates.arcus-azure.net/).

Blogs:

- [Advanced project template features](https://www.codit.eu/blog/making-arcus-templates-more-powerful/)
