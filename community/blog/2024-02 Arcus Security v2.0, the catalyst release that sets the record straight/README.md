# Arcus Security v2.0, the catalyst release that sets the record straight
What the Arcus Security v2.0 release did, was make use of the required .NET 8 update, to bring in small breaking changes with big impact. Setting the record straight.

## .NET 8 update
After the Arcus Observability v3.0 release, the Security library is next. While the Observability update is the start of the release round, the Security update is the catalyst. There are several Arcus libraries making use of the Security library, which means that several libraries can be updated toward .NET 8 simultaneously.

Just like the Observability update, this major release also says goodbye to .NET Core, but still supports .NET 6 and .NET Standard 2.1 for backward compatibility reasons.

## Vulnerable packages
A lesson learned from previous .NET upgrade rounds was to focus on the .NET version itself, rather than any other open issues. As with any lesson, this is the exception. There were some vulnerable Microsoft packages, related to interaction with Azure Key vault residing in the library. This major update was the perfect opportunity to step away from these, removing any deprecated packages and types, and fully support the new and safer approach for Azure Key vault interaction.

Everything was in place to do this change securely, going from the necessary alternative functionality mentioned in any deprecated functionality, so we expect that this transition will go smoothly. Any additional info is available on the feature documentation, plus support is given on any open issues. 

## Simplified API
One of the bit benefits of this major release, on a code level, is the simplification of the exposed `AddProvider` API in the secret store. Due to a previous, unmaintainable design decision of optional parameters, we were stuck with certain conflicting method overloads. Previous releases have worked around this problem and have added the necessary deprecated messages that direct towards a future solution. But this release finally offers the last step in making the secret store API dummy- and future-proof.

This release also includes several other removals that were leftovers from previous design decisions (like the empty `CacheConfiguration` constructor). The result is a simpler, cleaner library with self-evident ways of adding and registering secret providers in the secret store.

## Conclusion
The Arcus Security v2.0 is the start of many other .NET 8 Arcus releases, while also providing many enhancements related to security and design.

Take a look at the [release notes](https://github.com/arcus-azure/arcus.security/releases/tag/v2.0.0) and [feature documentation](https://security.arcus-azure.net/) to learn more about Arcus Security.

See [our official documentation](https://security.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.security/issues/new/choose).

Thanks for reading!
-Arcus team