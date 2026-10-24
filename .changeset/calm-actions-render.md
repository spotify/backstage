---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': patch
'@backstage/cli-module-build': patch
'@backstage/plugin-mcp-actions-backend': patch
---

Added support for declaring React UIs on backend actions. Action UIs are built
as self-contained browser resources and exposed to compatible MCP Apps hosts,
while clients without UI support continue to invoke the same actions normally.
