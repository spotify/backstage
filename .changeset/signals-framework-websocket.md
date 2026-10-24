---
'@backstage/plugin-signals-backend': patch
---

Register WebSocket upgrades through the framework router so the first connection works without a prior HTTP request. Preserve user-only authentication and existing token-as-protocol clients, while keeping only the health endpoint public over HTTP.
