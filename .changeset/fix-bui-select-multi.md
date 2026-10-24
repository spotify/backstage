---
'@backstage/plugin-scaffolder-react': patch
---

Fixed BUI theme `SelectWidget` to support multi-select schemas. The widget now uses `selectionMode="multiple"` on `@backstage/ui` `Select` when required, and properly resolves values in blur/focus handlers.
