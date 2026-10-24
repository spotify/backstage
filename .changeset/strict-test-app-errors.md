---
'@backstage/frontend-test-utils': minor
---

**BREAKING**: `renderInTestApp` and `renderTestApp` now throw when the test app has errors that would replace a real app with its error page, such as `API_FACTORY_CONFLICT`. Previously these errors were ignored, so a test could pass for an app that cannot start. Warnings that a real app only logs, such as `EXTENSION_IGNORED`, are still ignored.

**Migration:** fix the reported error in the test setup. The most likely one is `API_FACTORY_CONFLICT` from providing an API that another plugin owns, such as a `core.*` API passed in `extensions`. That override was always rejected, so remove it, or provide it from a module for the owning plugin. To replace an API in a test, use the `apis` option instead.
