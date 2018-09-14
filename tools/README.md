# Arcus - Tools
Arcus provides some tooling to streamline the governance & setup of new projects.

## GitHub Repo Configurator
GitHub Repo Configurator configures a GitHub repository according to a defined repository manifest.

### Building the tool
You can easily build the tool with the .NET Core commands:
```shell
dotnet build .\src\Arcus.Tools.Repository.App\Arcus.Tools.Repository.App.csproj
```

### Running the tool
Run the tool
```shell
Arcus.Tools.Repository.App.exe
        --username "<github-username>"
        --password "<github-password>"
        --repo-name "<github-repo>" #  example: arcus/arcus.keyvault
        --configuration-file "<path-to-configuration>"
```

### Manifest
A manifest is used to describe what labels, issues and milestones are required.

```yaml
labels:
  - name: management
    description: All issues related to management of the project
    color: f282af
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