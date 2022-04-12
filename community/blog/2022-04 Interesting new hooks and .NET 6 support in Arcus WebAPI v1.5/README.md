# Interesting new hooks and .NET 6 support in Arcus WebAPI v1.5
Lots of new interesting things are now available in Arcus WebAPI. This blog will run-down some of these new features.

## Request tracking with custom body serialization for reducing personal information
[Request tracking](https://webapi.arcus-azure.net/features/logging/) was already available in a couple of versions ago of [Arcus Web API](https://webapi.arcus-azure.net/). The tracking functionality allowed several options plus several routing filters on when/where the request tracking should take place. This request tracking functionality is also capable of sanitizing a custom set of headers that needs to be tracked. The reason for this customization is because some headers should never be tracked, for example authentication headers

While this is a very helpful feature, the customization was missing something crucial: we don't allow custom sanitization of the request/response body. This, too, can contain sensitive or personal information that should not be exposed in any logging system. Arcus Web API v1.5 solves this the same way the sanitization of headers occurs: with overridable functionality.

Here is a rudimentary(!) example of what this could look like. Note that all overridable functionality is optional and doesn't have to be overridden.

```csharp
using Arcus.WebApi.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

public class PIIRequestTrackingMiddleware : RequestTrackingMiddleware
{
    public PIIRequestTrackingMiddleware(RequestDelegate next, ILogger<RequestTrackingMiddleware> logger) : base(next, logger)
    {
    }

    protected override string SanitizeRequestBody(HttpRequest request, string requestBody)
    {
        if (request.HasJsonContentType())
        {
            var json = JObject.Parse(requestBody);
            json.Property("clientId").Remove();

            return json.ToString();
        }

        return requestBody;
    }

    protected override string SanitizeResponseBody(HttpResponse response, string responseBody)
    {
        if (request.HasJsonContentType())
        {
            var json = JObject.Parse(responseBody);
            json.Property("clientName").Remove();

            return json.ToString();
        }

        return responseBody;
    }
}
```

This custom-made request tracking middleware can then be given to the registration of the request tracking so that next time a request is processed, the personal and/or sensitive information is filtered-out from the tracking.

```csharp
using Microsoft.AspNetCore.Builder;

WebApplicationBuilder builder = WebApplication.CreateBuilder();
WebApplication app = builder.Build();

app.UseRouting();
app.UseRequestTracking<PIIRequestTrackingMiddleware>();
```

## Built-in JSON formatting extensions
Our [Arcus Web API project template](https://templates.arcus-azure.net/features/web-api-template) is using several great and highly recommended approaches to start off your project. One of these approaches is to limit the input/output formatting of models to only JSON formatting. What this means is that the registered input/output formatters were inspected and altered. While this is a valuable addition to the Web API project template, it is still somewhat boilerplate code that with its inspection code doesn't make the template a very user-friendly or clean place to work in.

Arcus Web API v1.5 changes this. In a new library called `Arcus.WebApi.Hosting`, we have added extensions on the MVC options so that this JSON formatting limitation can be added in a more fluent manner.

```csharp
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;

WebApplicationBuilder builder = WebApplication.CreateBuilder();

builder.Services.AddControllers(mvcOptions =>
{
     // Limit the available input/output formatting to only JSON formatting.
     mvcOptions.OnlyAllowJsonFormatting();

     // Configure that single (JSON) formatting. 
     mvcOptions.ConfigureJsonFormatting(jsonOptions =>
     {
         jsonOptions.IgnoreNullValues = true;
         jsonOptions.Converters.Add(new JsonStringEnumConverter());
     });
});
```

These extensions will greatly help make the Arcus Web API project not only easier to understand but more maintainable too. If we choose to change internal workings or additional built-in JSON features, we can update our extensions instead of altering the actual internal code of the project template. A cleaner approach for both consumers and maintainers.

## Better JWT Bearer authentication extension with secret store access
Arcus is not only to provide 'new' functionality. Most of the time, things are already there but just need some finetuning or has a 'gap' with other functionality. Arcus provides a bridge, a way of connecting all the necessary functionality so that developers solely can focus on the actual implementation.

This new feature is a great example of this principle. [JWT Bearer authentication](https://docs.microsoft.com/en-us/aspnet/core/security/authentication) is already available when configuring authentication in your API. The problem arises when you want to register the issuer symmetric key. Due to the location where the JWT Bearer authentication has to be registered, one doesn't have access to the necessary registered services to retrieve some kind of private key. The general application configuration (see [Configuration in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/)) is the sole access point to retrieve such values. In a previous post, we already stated that application configuration should only be used as configuration data and not secrets. The [Arcus secret store](https://security.arcus-azure.net/features/secret-store) is the answer to this, but as said, is not available at this point. Until now.

Arcus Web API v1.5 provides consumers with an alternative extension to register JWT Bearer authentication with access to the `IServiceProvider` which gives them access to all the registered services in the application. Included the Arcus secret store.

```csharp

using System.Text;
using Arcus.Security.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;

WebApplicationBuilder builder = WebApplication.CreateBuilder();

builder.Services.AddSecretStore(stores => ...)
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer((jwt, serviceProvider) =>
                {
                    // Get the Arcus secret store provider
                    var secretProvider = serviceProvider.GetRequiredService<ISecretProvider>();
                
                    // Retrieve signing key.
                    string key = secretProvider.GetRawSecretAsync(secretName).GetAwaiter().GetResult();
                
                    // Provide signing key to JWT Bearer validation parameters.
                    jwt.TokenValidationParameters = new TokenValidationParameters 
                    {  
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                    };
                });
```

## .NET 6 support
Last but definitely not least, is the long-awaited update for .NET 6 support. Arcus Web API is a massively used library and was lingering behind due to the almost-deprecated .NET Core target framework. This update ends this struggle while still supporting .NET Core for whoever needs it. This change is part in a long process in which we are making Arcus in its entirety fully .NET 6 compatible. This is not the final step on the entire Arcus front, but is the last step on the Web API front.

## Conclusion
Arcus Web API v1.5 has tons of new features and changes. There's a lot more to be found like better developer experience with faulted HTTP correlation registration and non-escaped JSON serialization during request tracking.

See [our official documentation](https://webapi.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.webapi/issues/new/choose).

Thanks for reading!
-Arcus team
