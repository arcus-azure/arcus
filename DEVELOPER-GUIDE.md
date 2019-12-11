Developer Guide
===

- [1. Coding Guidelines](#1-coding-guidelines)
    - [1.1. Usage of `var`](#11-usage-of-var)
    - [1.2. Working with `async` methods](#12-working-with-async-methods)

# 1. Coding Guidelines

## 1.1. Usage of `var`

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

## 1.2. Working with `async` methods

- Every async method should be suffixed with `Async`