# Finished Azure Integration Account functionality and other cool features in Arcus Scripting v0.6
Recently, we have released Arcus Scripting v0.6. The scripting library was quiet for a while, without any updates, so let's change that with this run-down post of new functionality coming to Arcus Scripting.

## Upload all Azure Integration Account artifacts
Azure Integration Accounts are critical for business-to-business (B2B) and integration workflows with Azure Logic Apps. The communication between different parties often requires artifacts. These artifacts include [trading partners](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-partners), [agreements](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-agreements), [maps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-maps), [schemas](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-maps), [certificates](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-certificates)...

When such an Azure Integration Account was previously setup in a client project, this was done manually in the Azure portal or via custom scripts. This tedious repeated work was the perfect candidate to be included in the Arcus Scripting library.

Starting from v0.6, one can finally upload all these artifacts with clean, well-named PowerShell functions. This wil reduce the custom scripts being copied from project to project, improve support and maintenance, and make the DevOps code a lot cleaner.

All functions are located within a single PowerShell module, called `Arcus.Scripting.IntegrationAccount`:
```powershell
 Install-Module -Name Arcus.Scripting.IntegrationAccount
```

Here's an example of uploading certificates to your Azure Integration Account:
```powershell
$resourceGroup = $env:AZURE_RESOURCE_GROUP
$integrationAccount = $env:AZURE_INTEGRATION_ACCOUNT
$certificatesPath = "C:\Certificates\"

Set-AzIntegrationAccountCertificates `
  -ResourceGroupName $resourceGroup `
  -Name $integrationAccount `
  -CertificateType 'Public' `
  -CertificatesFolder $certificatesPath
# Logs:
# Uploading certificate 'MyFirstCertificate.cer' into the Azure Integration Account 'my-integration-account'
# Certificate 'MyFirstCertificate.cer' has been uploaded into the Azure Integration Account 'my-integration-account'
# ----------
# Uploading certificate 'MySecondCertificate.cer' into the Azure Integration Account 'my-integration-account'
# Certificate 'MySecondCertificate.cer' has been uploaded into the Azure Integration Account 'my-integration-account'
# ----------
```

For more information on all things Azure Integration Account, see our [documentation page](https://scripting.arcus-azure.net/Features/powershell/azure-integration-account) where all the available PowerShell functions are described.

## Adding Azure App Service application settings with ease
Azure App Services can have common application settings. Just like local application settings, these should not contain any sensitive or secret information, but are especially useful to pass-in dynamic configuration values that can manipulate the application. Setting such application settings has to be done via the Azure portal. With Arcus Scripting v0.6, you don't have to make that trip to the portal anymore.

Installing the new library `Arcus.Scripting.AppService` gives you access to the Azure App Service functionality:
```powershell
PS> Install-Module -Name Arcus.Scripting.AppService
```

Setting Azure App Service application settings was never so easy:
```powershell
$resourceGroup = $env:AZURE_RESOURCE_GROUP
$appService = $env:AZURE_APP_SERVICE

Set-AzAppServiceSetting `
  -ResourceGroupName $resourceGroup `
  -AppServiceName $appService `
  -AppServiceSettingName 'LogLevel' `
  -AppServiceSettingValue 'Warning'
# Logs:
# Checking if the App Service with name 'my-app-service' can be found in the resource group 'my-resource-group'
# App service has been found
# Extracting the existing application settings
# Setting the application setting 'LogLevel'
# Successfully set the application setting 'LogLevel' of the App Service 'my-app-service' within resource group 'my-resource-group'
```

For more information on this module, see our [documentation page](https://scripting.arcus-azure.net/Features/powershell/azure-app-service).

## Extended ARM template content injection with absolute file paths
One of the new features in v0.6 is entirely written by a contributor. It's great to see our library expanding with features that were missing. All these additions grow from the usage of the library and the healthy reflex to contribute the missing pieces. In this case, our ARM template functionality to inject content into the template was missing something. We allowed relative value files to be injected into the ARM template but didn't have support for absolute external file paths. The way it was updated made sure that we stay backwards compatible with both relative file paths, making this a very flexible piece of functionality.

All ARM functionality is located in the `Arcus.Scripting.ARM` powershell module:
```powershell
PS> Install-Module -Name Arcus.Scripting.ARM
```

When using the following ARM template example, we can now use an absolute file path for the `FileToInject` value:
```json
{
    "type": "Microsoft.ApiManagement/service/apis",
    "name": "[concat(parameters('ApiManagement.Name'),'/', parameters('ApiManagement.Api.Name'))]",
    "apiVersion": "2019-01-01",
    "properties": {
        "subscriptionRequired": true,
        "path": "demo",
        "value": "${ FileToInject='C:\\openapi\\api-sample.json', InjectAsJsonObject}$",
        "format": "swagger-json"
    },
    "tags": "[variables('Tags')]",
    "dependsOn": [
    ]
}
```

The injection then can be done with a simple command:
```powershell
Inject-ArmContent -Path deploy\arm-template.json
```

For more information on the different features of the ARM module, see our [documentation page](https://scripting.arcus-azure.net/Features/powershell/arm).

## Conclusion
This new version of Arcus Scripting has received the most contributions so far! It's amazing how our contributors help us improve the library. Going from better logging to easier understandable documentation to fully working features. This proves that this library really helps people in their daily work.

The Arcus Scripting release has a lot more to offer. Come take a look at our [documentation page](https://scripting.arcus-azure.net/) for a list of all the available functionality. If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.scripting/issues/new/choose).

Thanks for reading!
-Arcus team
