# Announcing Arcus Scripting

During DevOps development, interacting with Azure resources was done with PowerShell scripts using the [AzureRM](https://www.powershellgallery.com/packages/AzureRM/6.13.1) modules.
Setting up new projects with similar needs, often meant that we were forced to copy the scripts into the source control of this new project, resulting in a lot of duplications, and due to the lack of a real management system, there was no way to follow up on any changes. In the last case, one was forced to manually change all the scripts spread across all the projects.

This problem leads us to introduce the [Arcus Scripting](https://github.com/arcus-azure/arcus.scripting)-repository, where we define, test and manage the PowerShell scripts that can help you interact with Azure resources during development or deployment. While creating this repository, we decided to remove any references to the _old_ [AzureRM](https://azure.microsoft.com/en-us/blog/azure-powershell-cross-platform-az-module-replacing-azurerm/)-library and make use of the cross-platform [Az](https://docs.microsoft.com/en-us/powershell/azure/new-azureps-module-az?view=azps-4.5.0) PowerShell library instead, making our scripts even more relevant.

Come and take a look at what this first version [v0.1](https://github.com/arcus-azure/arcus.scripting/releases/tag/v0.1) has to offer!
All features described below are published in separate PowerShell modules, published at the [PowerShell Gallery](https://www.powershellgallery.com/packages?q=Arcus.Scripting).

## Azure API Management

The `Arcus.Scripting.ApiManagement` PowerShell module already has a lot of functionality and is even the most populated module in this first version.
Included in this version the functionality goes from creating to importing to removing resources on an API Management instance:

* [Creating a new API operation in the Azure API Management instance](https://scripting.arcus-azure.net/features/powershell/azure-api-management#creating-a-new-api-operation-in-the-azure-api-management-instance)
* [Importing a policy to a product in the Azure API Management instance](https://scripting.arcus-azure.net/features/powershell/azure-api-management#importing-a-policy-to-a-product-in-the-azure-api-management-instance)
* [Importing a policy to an API in the Azure API Management instance](https://scripting.arcus-azure.net/features/powershell/azure-api-management#importing-a-policy-to-an-api-in-the-azure-api-management-instance)
* [Importing a policy to an operation in the Azure API Management instance](https://scripting.arcus-azure.net/features/powershell/azure-api-management#importing-a-policy-to-an-operation-in-the-azure-api-management-instance)
* [Removing all Azure API Management defaults from the instance](https://scripting.arcus-azure.net/features/powershell/azure-api-management#removing-all-azure-api-management-defaults-from-the-instance)

See the [docs](https://scripting.arcus-azure.net/preview/features/powershell/azure-api-management) for more information on these functions.

## Azure Key Vault

Another module we created, was specifically designed to collect functionality related to the Azure Key Vault.
We figured there's a lot of extra functionality that can be useful during interacting with this Azure resource.

The `Arcus.Scripting.KeyVault` PowerShell module contains now only two functions: `Get-AzKeyVaultAccessPolicies` and `Set-AzKeyVaultSecretFromFile` but is for sure going to expand in more functionality.

Following example shows how we can get all the access policies on the Azure Key Vault into a PowerShell object.

```powershell
PS> $accessPolicies = Get-AzKeyVaultAccessPolicies -KeyVaultName "arcus-key-vault"
# accessPolicies: {list: [{tenantId: ...,permissions: ...}]}
```

See the dedicated [docs](https://scripting.arcus-azure.net/features/powershell/azure-key-vault) pages for more info on this subject.

## Azure Data Factory

One of the approaches we would like to make for better user-friendliness, is splitting enable/disable, setting/getting, start/stop... functionality each time in 2 different functions instead of a single function that does both according to given arguments. This will make things much clearer and simpler.

A good example of this, is how we created the `Arcus.Scripting.DataFactory` PowerShell module. This module has two functions to enable and disable a trigger of an Azure Data Factory pipeline: `Enable-AzDataFactoryTrigger` and `Disable-AzDataFactoryTrigger` instead of the original `EnableDisableDataFactoryTrigger`.

Following example shows how we can enable the Azure Data Factory trigger:

```powershell
PS> Enable-AzDataFactoryTrigger -ResourceGroupName "arcus-resource-group" -DataFactoryName "arcus-data-factory-name" -DataFactoryTriggerName "arcus-data-factory-trigger-name"
# The trigger 'my-data-factory-trigger-name' has been enabled.
```

See the [docs](https://scripting.arcus-azure.net/features/powershell/azure-data-factory) for more information on these two functions.

## Azure (Table) Storage

The `Arcus.Scripting.Storage.Table` PowerShell module is the start of a whole bunch of storage-related scripts that will in the future be collected in a `Arcus.Scripting.Storage` PowerShell module. For now, we only have the Azure Table Storage module which already contains the functionality to create a new table inside an Azure Storage Account.
The `Create-AzStorageTable` also has the ability to re-create an existing table if that is required.

```powershell
PS> Create-AzStorageTable -ResourceGroupName "stock" -StorageAccountName "admin" -TableName "products"
# Creating table 'products' in the storage account 'admin'..."
```

See the [docs](https://scripting.arcus-azure.net/features/powershell/azure-storage) for more information on this function.

## Azure Resource Manager (ARM)

The `Arcus.Scripting.ARM` PowerShell module has been built to help you in manipulating ARM templates before triggering a deployment, allowing you to reduce the complexity of these templates.  
Currently, this module contains the capability to inject content into an ARM template, controlling the formatting of the injected content.
After importing the module, the `Inject-ArmContent` function is available to you.

The [docs](https://github.com/arcus-azure/arcus.scripting/blob/master/docs/preview/features/powershell/arm.md) has an example of an OpenAPI specifications you'd want to deploy.

## Azure DevOps

Something that coming up several times but was never actually seen as a separate functionality, was setting Azure pipeline variables. This functionality was scattered across scripts and was making the functions itself unnecessary complex. By separating this functionality in a dedicated module only for Azure DevOps related functionality, we have made using these functions a lot more user-friendly.

The `Set-AzDevOpsVariable` takes in the name and the value of the variable. It's as simple as that!

```powershell
PS> Set-AzDevOpsVariable -Name "Arcus.KeyVault.VaultUri" -Value "https://arcus.azure.vault.com"
```

See the [docs](https://scripting.arcus-azure.net/features/powershell/azure-devops) for more information on this function.

## What's on the Horizon

But this is only the beginning of a great scripting story!
Here are some features that are on the horizon:

* [Azure API Management](https://github.com/arcus-azure/arcus.scripting/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%3Aapi-management)
  * [Provide script for restoring an Azure API Management service](https://github.com/arcus-azure/arcus.scripting/issues/76)
  * [Provide script to backup an Azure API Management service](https://github.com/arcus-azure/arcus.scripting/issues/75)
  * [Provide script to set the subscriptionKey on an Azure API Management service](https://github.com/arcus-azure/arcus.scripting/issues/39)
* [Azure Key Vault](https://github.com/arcus-azure/arcus.scripting/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%3Akey-vault)
  * [Provide script for importing certificate as base64-string into Azure Key Vault](https://github.com/arcus-azure/arcus.scripting/issues/71)
* [Azure Logic Apps](https://github.com/arcus-azure/arcus.scripting/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%3Alogic-apps)
  * Provide scripts to [enable](https://github.com/arcus-azure/arcus.scripting/issues/19) or [disable](https://github.com/arcus-azure/arcus.scripting/issues/20) logic apps in a fixed order, preventing data-loss during an upgrade

Are we missing something? Don't hesitate to [make a suggestion](https://github.com/arcus-azure/arcus.scripting/issues/new?template=Feature_request.md) and we're happy to help where we can!
Thanks for reading!
Arcus team
