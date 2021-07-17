---
'example-app': patch
'@backstage/core-components': patch
'@backstage/create-app': patch
'@backstage/plugin-api-docs': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-techdocs': patch
---

Improve the responsiveness of the EntityPage UI. With this the Header component should scale with the screen size & wrapping should not cause overflowing/blocking of links. Additionally enforce the Pages using the Grid Layout to use it across all screen sizes & to wrap as intended.
