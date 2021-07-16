---
'@backstage/core-components': patch
'@backstage/test-utils': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
---

Changing the layout of the Catalog & API page to use responsive wrappers for table & filters. The goal is to enforce a responsive layout & that the Catalog & API page are better useable on smaller screens by showing more of the main content. To apply this changes to your custom catalog page, you can add the wrappers following the updated documentation on catalog customization.

Additionally, the tests for Material UI breakpoints were adjusted & used to test the responsive wrappers.
