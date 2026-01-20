# How Arcus Testing follows all the test standards
The Arcus Testing umbrella library is designed to help with code testing. Under the hood, it builds on testing patterns that promote good code practice to users.

## Temporary fixtures to prevent resource leakage
A test 'fixture' or a test 'double' is something that is required to set up before a interaction test with the system can be made. In unit tests, these can be simple classes; in integration-like tests, these can be entire components. Arcus Testing has several fixtures that help with interaction between state-like Azure resources like Azure Storage account, Azure CosmosDb, and others. It works as a temporary state for the system in which the test can verify the functionality. Afterwards, the fixture reverts its changes automatically to prevent any lingering state that is left behind during the test.

## Customization for back door manipulation
Tests are often as diverse as the system it's trying to verify. The same creativity that is needed to implement the application code is needed to think about ways to test it. Because of this, tests usually have a lot of customization code - in bad test code, this will show itself as a lot of code duplication. Arcus Testing is specifically designed for customization. It allows users to change assertion messages, setup/teardown operations, or even entire states. This is especially needed when tests require back door manipulation.

## Repeatability by minimizing responsibility
In all enthusiasm, Arcus Testing could become a big clunky library that brings a lot of dependencies with it and forces testers to write code in a certain way. When designing the library, there was thought about the different testing frameworks that people use, the way they want to have the flexibility of writing certain setup/teardown operations themselves, taking control of their own interactions. Arcus Testing is made as lightweight as possible, doing only the minimal work it is expected of. Even within the provided temporary fixtures and other functionality, it does not alter states that were already there. By doing so, it minimizes its responsibility and maximizes the repeatability of the tests.

## Optimal logging and failures to eliminate frequent debugging
Debugging test code is a bad practice. In ideal situations, that should never happen. If the test code has logging/failures with enough context for the tester to know what happened when by who for how long, test debugging might be a thing from the past. Logging is the first place to look when test fail, so it should be made as clear as possible what happened for effective defect localization. Arcus Testing has logging built-in, without being overeager to log every trace to overload test outputs. It focuses on debug-like messages, especially during setup/teardown, and includes always the necessary context of what it did. Bye bye debugging.

## Conclusion
It might not be immediately visible by the simple API of Arcus Testing, but lots of thought and experience is baked-in into the provided functionality. It follows the major testing strategies without burdening the tester with it. In fact, the way Arcus Testing is written might even motivate the tester to continue writing good custom test code on top of it.

See the [feature documentation](https://testing.arcus-azure.net/) for more information on Arcus Testing.

Thanks for reading.
-Arcus team