Developer Guide
===

- [1. Coding Guidelines](#1-coding-guidelines)
  - [1.1. General](#11-general)
  - [1.2. Usage of `var`](#12-usage-of-var)
  - [1.3. Working with `async` methods](#13-working-with-async-methods)
  - [1.4. Testing](#14-testing)
- [2. Releasing](#2-releasing)
  - [2.1 Updating documentation to new version](#21-updating-documentation-to-new-version)

# 1. Coding Guidelines

## 1.1. General
- Every public field/method should be documented with XML docs
- One file should only contain one class
- Variable names should have a clear name and abbreviations should be avoided
    - Exception would be LINQ statements, for loops, etc
- Private class fields should be prefixed with `_` such as `_serviceBusClient`
- Avoid using optional parameters for constructors and public methods
- If-statements that use a one-liner should be wrapped in `{ }`, an exception could be return statement or exception
- Avoid doing inline method calls to improve readability
    - Example to avoid - `throw new ApplicationException($"Event grid publishing failed. Content {await response.Content.ReadAsStringAsync()}");`

## 1.2. Usage of `var`

It's ok to use `var` when the type of the variable is clear, but when calling methods you should explicitly mention the expected type.

Example:

```csharp
// OK
var value = "some value";
// OK
string value = "some value";
// NOK
var value = GetValue();
```

## 1.3. Working with `async` methods

- Every async method should be suffixed with `Async`

## 1.4. Testing
- A test should only test one specific scenario and a specific flow (ie. happy or failure)
- All tests for one class should be consolidated into one test class
    - Example `SecretKeyHandlerTests` contains all tests for the `SecretKeyHandler` class
- Every test method should have the following naming convention `{Method To Test}_{Scenario}_{Expected Outcome}`
    - Example: `Validate_WithValidSecretName_ShouldPass`

# 2. Releasing

## 2.1 Updating documentation to new version
When a future version is being developed, preview docs are located at the `./docs/preview/features` folder.
When this version is finally released, the docs should be updated by following these steps:
* Cut both the `./docs/index.md` file and `./docs/features` folder to a new folder `./docs/vX.X.X` with the name of the new version
* Copy both the `./docs/preview/index.md` file and `./docs/preview/features` folder to the root `./docs` folder so they act as the current features
* Add redirection and permalink the `./docs/index.md` file
  * ```
    permalink: /
    redirect_from:
       - /index.html
    ```
   And remove these two lines from the 'old' `./docs/vX.X.X/index.md` you just cut.
* Add a new 'older version' link to the preview index file `./docs/preview/index.md`, refering to the released `./docs/vX.X.X/`. 