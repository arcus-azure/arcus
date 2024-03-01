# The Arcus Web API v2.0 release reconciles with automatic Microsoft Tracking
The new Arcus Web API release provides new support for both the new .NET framework, as well as reconciles any unsupported situations with automatic Microsoft Tracking in Azure Functions applications.

## .NET 8 support
The new major Web API release is the third Arcus release that supports .NET 8. Same as with the previous releases, we have made sure that we still support .NET Standard 2.1 and .NET 6, but removed any reference with .NET Core. The impact of this will be more visible than the Observability and Security releases, as the Web API is one of the packages that is used directly in projects. Unlike Observability and Security, which are more core-like projects that other libraries build upon. It means that from now on, the real changes and power of .NET 8 will become visible in Arcus-supported projects.

## Automatic Microsoft Tracking in Azure Functions
One of the major features from previous Web API releases was the ability to include Microsoft's dependency tracking while using Arcus' Observability setup. We referred to this as 'automatic' tracking. In 'normal' web API and other types of projects, this worked fine, but Azure Functions applications are (and will?) always be a special case. Those kinds of projects use different packages while using the same technology. This strange design choice means that any extension of their existing functionality, also needs to take this separation in mind. To make matters worse, in-process Azure Functions applications use different packages and technology than isolated Azure Functions applications.

We saw that Microsoft was still working on a new version of an Observability package of their own to support automatic telemetry tracking of dependencies. Luckily, a new stable version of the package was released recently with .NET 8 supported for isolated Azure Functions and is included in our new Arcus Web API release.

## Simpler HTTP correlation
A big enhancement in this release is the simplification of HTTP correlation. Previously, we had both optional parameters and unnecessary base correlation options (from the Observability library) which made setting up HTTP correlation rather obscure. The jungle of deprecated members and options was becoming almost impenetrable.

Now the library is cleaned out of any deprecated members and is using an independent options model to configure HTTP correlation. This will make usage and extensibility much easier to use, while making the Observability library cleared of any specific implementation (which was previously the case with exposed HTTP language in the options).

## Conclusion
Having a new version of the Web API library means that we finally are at the brick of converting entire Arcus-supported projects with .NET 8 support. This new major version a big deal, as it will bring both the best features of the new .NET framework as any Arcus enhancements that we finally worked through.

Take a look at the [release notes](https://github.com/arcus-azure/arcus.webapi/releases/tag/v2.0.0) and [feature documentation](https://webapi.arcus-azure.net/) to learn more about Arcus Web API.

See [our official documentation](https://webapi.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.webapi/issues/new/choose).

Thanks for reading!
-Arcus team