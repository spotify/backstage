# @backstage/plugin-mcp-actions-backend

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-client@1.16.3
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/plugin-catalog-node@2.2.6

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0

## 0.2.2

### Patch Changes

- 4a27653: The default MCP server at `/api/mcp-actions/v1` is now always exposed. Previously, configuring `mcpActions.servers` replaced it, so the default endpoint was no longer served once a single named server was added. Named servers are now subsets of the default one, which continues to expose every registered action, so the same action can be exposed both there and on as many named servers as you like.
- Updated dependencies
  - @backstage/catalog-client@1.16.2
  - @backstage/config@1.3.9
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5

## 0.2.2-next.1

### Patch Changes

- 4a27653: The default MCP server at `/api/mcp-actions/v1` is now always exposed. Previously, configuring `mcpActions.servers` replaced it, so the default endpoint was no longer served once a single named server was added. Named servers are now subsets of the default one, which continues to expose every registered action, so the same action can be exposed both there and on as many named servers as you like.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0

## 0.2.1

### Patch Changes

- ec2b90f: Added support for configuring MCP server instructions for both default and named servers.
- d7d03d9: Replaced duplicated documentation in the README with a link to the full docs on `backstage.io`.
- e4983fd: Added audit logging for MCP server operations using the Backstage Auditor Service. The plugin now emits `connection`, `tool-discovery`, and `tool-execution` audit events, allowing adopters to monitor and audit MCP server activity.
- 9937a99: Added `scopes_supported` to the OAuth 2.0 Protected Resource Metadata (RFC 9728) response. Without this field, RFC-compliant MCP clients did not know which scope to request and never received a refresh token, causing sessions to expire with the short-lived access token. The field now includes `openid`, and also `offline_access` when `auth.experimentalRefreshToken` is enabled.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/plugin-catalog-node@2.2.4

## 0.2.1-next.2

### Patch Changes

- 9937a99: Added `scopes_supported` to the OAuth 2.0 Protected Resource Metadata (RFC 9728) response. Without this field, RFC-compliant MCP clients did not know which scope to request and never received a refresh token, causing sessions to expire with the short-lived access token. The field now includes `openid`, and also `offline_access` when `auth.experimentalRefreshToken` is enabled.

## 0.2.1-next.1

### Patch Changes

- d7d03d9: Replaced duplicated documentation in the README with a link to the full docs on `backstage.io`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.1

## 0.2.1-next.0

### Patch Changes

- ec2b90f: Added support for configuring MCP server instructions for both default and named servers.
- e4983fd: Added audit logging for MCP server operations using the Backstage Auditor Service. The plugin now emits `connection`, `tool-discovery`, and `tool-execution` audit events, allowing adopters to monitor and audit MCP server activity.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0

## 0.2.0

### Minor Changes

- 567bc4c: **BREAKING**: Removed the deprecated Server-Sent Events (SSE) MCP transport. MCP clients must use the Streamable HTTP endpoint at `/api/mcp-actions/v1` or a configured named-server endpoint.

### Patch Changes

- e2b3472: Updated OAuth discovery to use the stable `auth.clientIdMetadataDocuments` configuration while retaining compatibility with the deprecated experimental key.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-catalog-node@2.2.3

## 0.2.0-next.1

### Minor Changes

- 567bc4c: **BREAKING**: Removed the deprecated Server-Sent Events (SSE) MCP transport. MCP clients must use the Streamable HTTP endpoint at `/api/mcp-actions/v1` or a configured named-server endpoint.

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/catalog-client@1.16.1-next.0

## 0.1.14

### Patch Changes

- ed1be73: Validate each action against the MCP tool schema when responding to `tools/list`, and skip any action that doesn't conform instead of failing the entire response. A single misbehaving action with a malformed input schema will now be logged as a warning and omitted from the tool list, letting the remaining actions continue to be served.
- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2

## 0.1.14-next.1

### Patch Changes

- ed1be73: Validate each action against the MCP tool schema when responding to `tools/list`, and skip any action that doesn't conform instead of failing the entire response. A single misbehaving action with a malformed input schema will now be logged as a warning and omitted from the tool list, letting the remaining actions continue to be served.
- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.1
  - @backstage/backend-plugin-api@1.9.2-next.1

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0

## 0.1.13

### Patch Changes

- ca8951a: Fixed an issue where actions returned Markdown-formatted JSON instead of plain JSON and a `structuredContent` field for model context protocol responses.
- 8916f83: Trace spans are now emitted for MCP `tools/call` invocations, following OpenTelemetry server-side MCP semantic conventions.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/catalog-client@1.15.1
  - @backstage/config@1.3.8

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/types@1.2.2

## 0.1.12

### Patch Changes

- 282c114: Fix OAuth 2.0 Protected Resource Metadata endpoint returning internal plugin URL, preventing some MCP clients like Claude Code from authenticating
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- c6abc52: Fixed the `.well-known/oauth-protected-resource` resource URL to comply with
  [RFC 9728 Section 7.3](https://datatracker.ietf.org/doc/html/rfc9728#name-impersonation-attacks). Enabling dynamic resource paths.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/catalog-client@1.15.0
  - @backstage/config@1.3.7

## 0.1.12-next.2

### Patch Changes

- 282c114: Fix OAuth 2.0 Protected Resource Metadata endpoint returning internal plugin URL, preventing some MCP clients like Claude Code from authenticating
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/config@1.3.7-next.0

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.10

### Patch Changes

- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- dee4283: Added `mcpActions.name` and `mcpActions.description` config options to customize the MCP server identity. Namespaced tool names now use dot separator to align with the MCP spec convention.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- c74b697: Added support for splitting MCP actions into multiple servers via `mcpActions.servers` configuration. Each server gets its own endpoint at `/api/mcp-actions/v1/{key}` with actions scoped using include/exclude filter rules. Tool names are now namespaced with the plugin ID by default, configurable via `mcpActions.namespacedToolNames`. When `mcpActions.servers` is not configured, the plugin continues to serve a single server at `/api/mcp-actions/v1`.
- dc81af1: Adds two new metrics to track MCP server operations and sessions.

  - `mcp.server.operation.duration`: The duration taken to process an individual MCP operation
  - `mcp.server.session.duration`: The duration of the MCP session from the perspective of the server

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-client@1.14.0
  - @backstage/plugin-catalog-node@2.1.0

## 0.1.10-next.2

### Patch Changes

- c74b697: Added support for splitting MCP actions into multiple servers via `mcpActions.servers` configuration. Each server gets its own endpoint at `/api/mcp-actions/v1/{key}` with actions scoped using include/exclude filter rules. Tool names are now namespaced with the plugin ID by default, configurable via `mcpActions.namespacedToolNames`. When `mcpActions.servers` is not configured, the plugin continues to serve a single server at `/api/mcp-actions/v1`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2

## 0.1.10-next.1

### Patch Changes

- 62f0a53: Fixed error forwarding in the actions registry so that known errors like `InputError` and `NotFoundError` thrown by actions preserve their original status codes and messages instead of being wrapped in `ForwardedError` and coerced to 500.
- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.10-next.0

### Patch Changes

- dc81af1: Adds two new metrics to track MCP server operations and sessions.

  - `mcp.server.operation.duration`: The duration taken to process an individual MCP operation
  - `mcp.server.session.duration`: The duration of the MCP session from the perspective of the server

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.9

### Patch Changes

- 31de2c9: Added OAuth Protected Resource Metadata endpoint (`/.well-known/oauth-protected-resource`) per RFC 9728. This allows MCP clients to discover the authorization server for the resource.

  Also enabled OAuth well-known endpoints when CIMD (Client ID Metadata Documents) is configured, not just when DCR is enabled.

- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/catalog-client@1.13.0

## 0.1.9-next.1

### Patch Changes

- 8148621: Moved `@backstage/backend-defaults` from `dependencies` to `devDependencies`.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.1.8-next.0

### Patch Changes

- 69d880e: Bump to latest zod to ensure it has the latest features
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/backend-defaults@0.15.1-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.7

### Patch Changes

- 4d82a35: build(deps): bump `@modelcontextprotocol/sdk` from 1.24.3 to 1.25.2
- Updated dependencies
  - @backstage/backend-defaults@0.15.0
  - @backstage/backend-plugin-api@1.6.1

## 0.1.7-next.1

### Patch Changes

- 4d82a35: build(deps): bump `@modelcontextprotocol/sdk` from 1.24.3 to 1.25.2
- Updated dependencies
  - @backstage/backend-defaults@0.15.0-next.2

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.14.1-next.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1

## 0.1.6

### Patch Changes

- e83e038: Added `@cfworker/json-schema` as a dependency to this package part of the `@modelcontextprotocol/sdk` bump as it's required in the types
- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- 79ef471: Clarify error handling in readme and update handleError.ts to include all backstage/errors
- Updated dependencies
  - @backstage/backend-defaults@0.14.0
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1

## 0.1.6-next.1

### Patch Changes

- e83e038: Added `@cfworker/json-schema` as a dependency to this package part of the `@modelcontextprotocol/sdk` bump as it's required in the types
- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1

## 0.1.6-next.0

### Patch Changes

- 79ef471: Clarify error handling in readme and update handleError.ts to include all backstage/errors
- Updated dependencies
  - @backstage/backend-defaults@0.14.0-next.0
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2

## 0.1.5

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/catalog-client@1.12.1

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-defaults@0.13.1-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1

## 0.1.5-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/backend-defaults@0.13.1-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-node@1.19.1

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.1
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/catalog-client@1.12.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.13.0-next.0
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/catalog-client@1.12.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.0

## 0.1.3

### Patch Changes

- 1d47bf3: Proxy `/.well-known/oauth-authorization-server` to `/.well-known/openid-configuration` on `auth-backend` when `auth.experimentalDynamicClientRegistration.enabled` is enabled.
- 7f2a4a0: Updating docs
- d08b0c9: The MCP backend will now convert known Backstage errors into textual responses with `isError: true`.
  The error message can be useful for an LLM to understand and maybe give back to the user.
  Previously all errors where thrown out to `@modelcontextprotocol/sdk` which causes a generic 500.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/types@1.2.2
  - @backstage/backend-plugin-api@1.4.3

## 0.1.3-next.1

### Patch Changes

- 1d47bf3: Proxy `/.well-known/oauth-authorization-server` to `/.well-known/openid-configuration` on `auth-backend` when `auth.experimentalDynamicClientRegistration.enabled` is enabled.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.1
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1

## 0.1.3-next.0

### Patch Changes

- d08b0c9: The MCP backend will now convert known Backstage errors into textual responses with `isError: true`.
  The error message can be useful for an LLM to understand and maybe give back to the user.
  Previously all errors where thrown out to `@modelcontextprotocol/sdk` which causes a generic 500.
- Updated dependencies
  - @backstage/backend-defaults@0.12.1-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.12.0
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/backend-plugin-api@1.4.2

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.11.2-next.0
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.1

### Patch Changes

- 6bc0799: Fixed the example in the README for generating a static token by adding a subject field
- Updated dependencies
  - @backstage/backend-defaults@0.11.1
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-catalog-node@1.17.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/backend-defaults@0.11.1-next.1
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0

## 0.1.1-next.0

### Patch Changes

- 6bc0799: Fixed the example in the README for generating a static token by adding a subject field
- Updated dependencies
  - @backstage/backend-defaults@0.11.1-next.0
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/catalog-client@1.10.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 0.1.0

### Minor Changes

- 4ed0fb6: Initial implementation of an `mcp-actions` backend

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/backend-defaults@0.11.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
