# First Arcus (Observability) release of 2024 starts with a bang
The first Arcus release of 2024 is a major release on the Arcus Observability library. This post will go over the highlights.

## .NET 8 support
The v3.0 release of the Arcus Observability library is the first Arcus release that has .NET 8 support. This means that from now on we support both .NET 8 primary and .NET 6/.NET Standard secondary for backward compatibility. We have said goodbye to .NET Core.

It was important to make this a priority in our release strategy, and learning from the .NET 6 update, we have made this a success. This new update brings the newest features of .NET to Arcus and we hope to update the remaining Arcus libraries soon.

## Removing deprecation
The new release is a major release, which also brings some removals. All deprecated functionality that was previously released has been removed from this release. These are mostly logging extensions that were using incomplete or outdated parameters. The new available set of logging extensions is far simpler and easier to use.

Some types were also removed, like the `DependencyMeasurement` which has been replaced by the `DurationMeasurement`. This was because we tracked not only the duration of dependency telemetry but also of requests, which made the old type illogical to use.

## Reusable telemetry context
There also exists a fix in this release, which is the result of frequently using Arcus in the wild. The Observability library provides many logging extensions, almost all of them with a telemetry context. In a real-life project scenario, you might want to reuse the telemetry context across your logging so that all logging is tagged with the same custom dimensions. The problem with earlier releases; was that this was not taken into account as the context was being used as a mutable set. Making it difficult to reuse.

The new release fixes this by interacting with the telemetry context in an immutable manner. Now the context can be used across logging so that the entire project logging can be streamlined. This is a great example of how practical usage of the Observability library results in better support and a more dev-friendly experience.

## Conclusion
Arcus Observability v3.0 is the first Arcus release of 2024 and immediately brings a whole lot of changes to the table. We expect soon other Arcus library releases with .NET 8 support.

Take a look at the [release notes](https://github.com/arcus-azure/arcus.observability/releases/tag/v3.0.0) and [feature documentation](https://observability.arcus-azure.net/) to learn more about Arcus Observability.

See [our official documentation](https://observability.arcus-azure.net/) for more information on all the currently supported features.
If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact us](https://github.com/arcus-azure/arcus.observability/issues/new/choose).

Thanks for reading!
-Arcus team