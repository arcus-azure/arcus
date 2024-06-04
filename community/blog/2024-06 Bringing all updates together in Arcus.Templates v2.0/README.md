# Bringing all updates together in Arcus.Templates v2.0
The v2.0 release in the Templates library brings all the previously released updates together, making Arcus in its entirety .NET 8 compatible and ready for tomorrow.

## No more in-process Azure Functions
Starting from v2.0, the `--function-worker` project option is removed and all Azure Functions project templates are always created with the isolated target. Removing the in-process-specific functionality has an impact on how correlation and runtime packages are used in the background. The Databricks project template is also removed entirely, as this one was only supported with in-process.

The in-process option was mostly still there for backward compatibility, by default the isolated option was already chosen. Nonetheless this is a big change that was required to be .NET 8 compatible.

## Nullable types
Normally, the project templates try to not force certain ways of working upon the user. You see this in the minimal approach we use in the generated content of the resulting project. For nullable types, we made an exception as certain models that were provided gave warning signals on assigning nullable types to non-nullable values when the user activates nullable types.

v2 makes sure that values are nullable where needed - like serialization, and activates the use of nullable types in the project so it is by default activated on any resulting project. Bringing to the user the latest features, not because it is one of the latest features, but because it strengthens the security of the code.

## Chiseled Docker containers
We used Alphine (Debian) images in the past for their size, but now that chiseled images are available, we switched to chiseled (Ubuntu). They are of similar size, but have fewer components, reducing the attack surface. People are not always aware of the type of image they use when creating Docker containers, and we at Arcus try to take the necessary steps to provide users with the latest and safest option. Making it a safer world for us all.

## .NET 8
As mentioned, the v2.0 update brings .NET 8 to the Templates library. Each generated project will use the latest LTS version with all the NuGet packages installed to their latest version. Since the available projects depend a lot on (almost all) existing Arcus libraries, it was first required to update those libraries. This means that finalizing this v2.0 update, also finalizes the entire .NET 8 support update for Arcus. Up to .NET 10!

## Conclusion
With our new strategy to use smaller updates in case of .NET framework updates, we have achieved a quicker release time, but still updated necessary functionalities. There were a lot of breaking or removed changes along the way that are also included in this v2.0 major version. This new strategy focuses more on the end users. Now it is time for adaptation.

See [our official documentation](https://templates.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.templates/issues/new/choose).

Thanks for reading!
-Arcus team