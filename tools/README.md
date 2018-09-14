# Arcus - Tools
Arcus provides some tooling to configure new projects:

- **GitHub Repo Configurator -** Configures a GitHub repository according to a defined repository manifest

## GitHub Repo Configurator
GitHub Repo Configurator configures a GitHub repository according to a defined repository manifest.

Run the tool
```shell
Arcus.Tools.Repository.App.exe --username "<github-username>" --password "<github-password>" --repo-name "<github-repo, example: arcus/foo>" --configuration-file "<path-to-configuration>"
```

Manifest example:
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