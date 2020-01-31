# GitHub Repo Configurator
GitHub Repo Configurator configures a GitHub repository according to a defined repository manifest.

## Building the tool
You can easily build the tool with the .NET Core commands:
```shell
$ dotnet build .\src
```

## Running the tool
Run the tool
```shell
$ cd src\Arcus.Tools.Repository.App\bin\Debug\netcoreapp2.1
$ dotnet .\Arcus.Tools.Repository.App.dll
             --username "<github-username>"
             --password "<github-password>"
             --repo-name "<github-repo>" #  example: arcus-azure/arcus.keyvault
             --configuration-file "<path-to-configuration>"
```

## Manifest
A manifest is used to describe what issues and milestones are required.

```yaml
issues:
  - title: Provide NuGet badge
    description: Provide NuGet badge in the README
    milestoneName: Project Setup
    labels:
    - management
milestones:
 - title: Project Setup
   description: All tasks related to creating a new Arcus project
```
