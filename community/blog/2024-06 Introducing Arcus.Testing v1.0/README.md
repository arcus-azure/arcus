# Introducing Arcus.Testing v1.0
The Arcus.Testing library was previously mostly used for internal usage but has recently received an update that makes it more broadly usable. Introducing v1.0.

## Migration from Codit Testing Framework
The Codit Testing Framework was a very good initiative in the past that tried to capture common practices in test suites and provide a central place to manage them. These functions were both Azure-specific and non-technical. While it was prefixed 'Codit' and was only for internal use, it did not contain any Codit-specific or 'secretive' functionality. The motivation for this initiative is very good, but it lacked the quality that Codit strives towards and several common test practices that our own DevOps/QA Practice advocates. The decision was made to move the initiative to Arcus, solving both problems in a single stroke: Arcus has built-in quality and is the result of Practice's decisions.

This brings us to Arcus.Testing v1.0, which contains all the non-Azure-specific functionality that previously resided in the Testing Framework, but there is more.

## Comparing (XML, JSON & CSV) documents
One of the commonly needed features in integration projects is comparing documents. Arcus.Testing builds on top of what was previously available in the Testing Framework. It allows you to compare XML, JSON & CSV documents with ease and provides a highly descriptive error message in case of a test failure. This last part is critical in this functionality, as you want to know the exact location, node, line, row... where the difference resides.

An example using XML documents:

```csharp
using Arcus.Testing;

string expected = "<root><child>100</child></root>";
string actual = "<root><child>101</child></root>";

AssertXml.Equal(expected, actual);
// Arcus.Testing.EqualAssertionException
// AssertXml.Equal failure: expected and actual XML documents do not match
// actual XML has a different value at /root/child/text(), expected 100 while actual 101
//
// Expected:
// <root>
//   <child>100</child>
// </root>
//
// Actual:
// <root>
//   <child>101</child>
// </root>
```

🔗 For more information about the available options for this and other types of comparisons, please see the [feature documentation](https://testing.arcus-azure.net/features/assertion/).

## Common test practices
The previous section on migration already talked about 'missing test practices' in the Testing Framework. This is something that Arcus.Testing v1.0 also fixes. With 'common practices' we mean the way you write maintainable and stable tests, specifically integration/system tests. The following problems are solved with following available functionalities:

* ❌ Multiple test fixtures need to be disposed independently - one failed disposal should not halt another
  * ✅ The `DisposableCollection` lets us add one or more `I(Async)Disposable` instances that are independently (and retryable) disposed of when the collection is disposed.
* ❌ Network-related or other unstable functionality is only available 'after a while'
  * ✅ The `Poll.Target(...).Until(...)` functionality allows for reusable polling operations that interact with a target resource until the interaction stops throwing failures or a property is available (ex. HTTP status `200 OK`).
* ❌ Test suite requires external configuration values that need to be injected as tokens in the project.
  * ✅ The `TestConfig` is an `IConfiguration` implementation that already loads (by default, configurable) the `appsettings.json` file and any number of additional optional files, plus provides meaningful exceptions when a configuration value is tried to be loaded and is blank or not replaced yet (still contain tokens).

These common practices are designed to be non-technical. When Arcus.Testing evolves and more specific functionality will become available, it will build on top of these features.

## From test framework-dependent logging to Microsoft logging
Logging during testing was one of the only features that were already there when Arcus.Testing was used for internal use. xUnit was the commonly used testing framework, so the logging focused mostly on that. Starting from v1.0, we have created dedicated loggers for also the NUnit and MSTest frameworks. By providing specific packages for these loggers, we show more clearly what is available.

The idea behind these packages is that all test frameworks use different ways to add custom logging to the test results: xUnit uses their `ITestOutputHelper`, NUNit uses their `TestContext.Out/Error`, MSTest uses their `TestContext.WriteLine`... What Arcus.Testing does is to write a Microsoft `ILogger` implementation of these specific components. Currently, there is not much-added value as we do not have a lot of tech-specific packages, but if we later develop functionality to 'temporarily save an Azure blob file', we can use the `ILogger` to write trace messages and let the tester decide what testing framework and 'plumbing' package of use it wants to use.

These packages remove any specific testing framework-related code in any upcoming functionality. You can already see this in how the `DisposableCollection` is implemented: you can pass in an `ILogger`.

## Conclusion
Arcus.Testing v1.0 is only the first step in providing meaningful functionality to test suites. It provides the baseline which all future functionality will build upon. It is the result of the initiative that started with the Codit Testing Framework, combined with Arcus quality and the experience that the DevOps/QA Practice provides.

Have a look at our [release notes](https://github.com/arcus-azure/arcus.testing/releases/tag/v1.0.0) and [official documentation](https://testing.arcus-azure.net/) for more information on this new release.

If you have any questions, remarks, comments, or just want to discuss something with us; feel free to [contact the Arcus team at Codit](https://github.com/arcus-azure/arcus.testing/issues/new/choose).

The future is bright for testing in Codit projects.

Thanks for reading!
-Arcus team