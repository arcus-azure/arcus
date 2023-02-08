# Integrating Arcus Security in a non-invasive manner
One of the issues with integrating Arcus in projects is that it is thought of as 'evasive', or 'breaking current functionality'. This post will show you how Arcus can make your application more secure, without bulldozing into your code base.

## Existing (Azure Functions) application
There exists a misconception that Arcus is not available in Azure Functions, so for the sake of this exercise, we will show you how an existing Azure Function HTTP trigger can be altered to use Arcus Security to retrieve its secrets.

Let's first start with the basics: we have an Azure Functions HTTP trigger application that reads environment variables and connects to an Azure Blob storage. In fast development cycles, all the necessary information (both secrets and configuration) is currently presented to the application in environment variables.

```csharp
using Azure.Storage;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureAppConfiguration(builder =>
    {
        builder.AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        services.AddAzureClients(clients =>
        {
            string serviceUrl = context.Configuration["AZURE_BLOB_URL"];
            string accountName = context.Configuration["AZURE_BLOB_ACCOUNTNAME"];
            string accountKey = context.Configuration["AZURE_BLOB_ACCOUNTKEY"];

            clients.AddClient<BlobServiceClient, BlobClientOptions>((options, serviceProvider) =>
            {
                return new BlobServiceClient(new Uri(serviceUrl), new StorageSharedKeyCredential(accountName, accountKey));
            });
        });
    })
    .Build();

host.Run();
```

This Azure Blob storage client is injected in our Azure Function HTTP trigger:

```csharp
using System.Net;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Logging;

public class StoreFunction
{
    private readonly BlobServiceClient _blobClient;
    private readonly ILogger _logger;

    public StoreFunction(
        IAzureClientFactory<BlobServiceClient> clientFactory,
        ILoggerFactory loggerFactory)
    {
        _blobClient = clientFactory.CreateClient("Default");
        _logger = loggerFactory.CreateLogger<StoreFunction>();
    }

    [Function("store")]
    public HttpResponseData Run(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData request)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request");

        // Save something to Azure Blob storage with client...
        
        return request.CreateResponse(HttpStatusCode.Accepted);
    }
}
```

## Separating sensitive secrets from application configuration
The trick is to find the secrets in your application configuration and treat them differently. [We have a whole section](https://security.arcus-azure.net/features/secret-store) in our feature documentation that describes why Arcus is recommending this. Why it is safer, cleaner, and more maintainable. It is important to realize that Arcus does not act as a 'nice to have' at this point, but brings real value to the table which is both critical and necessary. ([Learn more about the dangers of solely using application configuration](https://www.codit.eu/blog/introducing-secret-store-net-core/)).

The Azure Blob storage account key is the main secret in this example. Ideally, configuration and secrets reside in separate places instead of keeping them in the same place. This example starts from a scenario where they are both stored in the same place, but that does not mean that they should reside in the same place in your application code. Treating secrets as secrets and not public configuration data is a big selling point here. It means that we mentally work more carefully where we retrieve secret information and where we retrieve common data.

## Seamless secret retrieval with Arcus Security
To introduce the Arcus secret store from the Arcus Security in this Azure Functions example, we only need a single package: `Arcus.Security.Core`. This package contains the secret store and some common built-in secret providers.

After this package is installed, we can initialize the secret store with environment variables and retrieve the Azure Blob storage account key from it:

```csharp
using Arcus.Security.Core;
using Azure.Storage;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureAppConfiguration(builder =>
    {
        builder.AddEnvironmentVariables();
    })
    .ConfigureSecretStore((config, stores) =>
    {
        stores.AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        services.AddAzureClients(clients =>
        {
            string serviceUrl = context.Configuration["AZURE_BLOB_URL"];
            string accountName = context.Configuration["AZURE_BLOB_ACCOUNTNAME"];

            clients.AddClient<BlobServiceClient, BlobClientOptions>((options, serviceProvider) =>
            {
                var secretProvider = serviceProvider.GetRequiredService<ISecretProvider>();
                string accountKey = secretProvider.GetRawSecret("AZURE_BLOB_ACCOUNTKEY");

                return new BlobServiceClient(new Uri(serviceUrl), new StorageSharedKeyCredential(accountName, accountKey));
            });
        });
    })
    .Build();

host.Run();
```

👀 Notice that the Azure Functions HTTP trigger does not have to change, it is only the retrieval of secrets that has to be adapted. At this point, one may wonder why we initialize both the application configuration and the secret store with the same source (environment variables). And that is a good thing! This means that we start to think of our input as different kinds of types. Both the Arcus environment secret provider and the Microsoft environment variable configuration source can retrieve only a portion of the environment variables by specifying a prefix. This could be a great way to already make the distinction right from the start between application configuration and sensitive secrets.

## Conclusion
This post showed a way to integrate the Arcus secret store into an existing application without being evasive of the actual application code. It is by design that the example uses Azure Blob storage, as this is an Azure technology we do not necessarily work upon in Arcus (like we do with Service Bus or Event Hubs). It is proof that Arcus can be used in any number of scenarios and should not be limited by the technologies described in our feature documentation.

This example shows how we can separate application configuration from sensitive secrets. This is an important step in making our application more secure and safer to use during future development. Treating secrets as secrets is a mentality shift that will bring great value as it will force you to think about your inputs differently. Not all inputs are public data and should be treated accordingly. 

🏅Furthermore, we should place the secrets in a secure place (like Azure Key vault) instead of storing secrets and application configuration in the same place. Since the `ISecretProvider` is now being used for secret retrieval, changing it from environment variables to [Azure Key vault](https://security.arcus-azure.net/Features/secret-store/provider/key-vault) is fairly easy and does not require any application code change.

🚩 [See our feature documentation](https://security.arcus-azure.net/features/secret-store) to learn more about the Arcus secret store. We also have a [user guide](https://security.arcus-azure.net/Guides/add-secret-store-with-keyvault-integration) that will gently guide you through the process of using Azure Key vault in the Arcus secret store.

Thanks for considering Arcus!
The Arcus team
