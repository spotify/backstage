---
id: actions-registry
title: Actions Registry (alpha)
sidebar_label: Actions Registry (alpha)
description: Documentation for the Actions Registry Service
---

## Overview

The Actions Registry Service is a core service designed to provide a distributed registry for actions that can be executed within Backstage backend plugins. This service allows plugins to register reusable actions with well-defined schemas and execution logic, promoting consistency and reusability across the Backstage ecosystem.

## Action Structure

Each action registered with the service must conform to the `ActionsRegistryActionOptions` type, which includes:

### Required Properties

- **`name`:** A unique identifier for the action (string)
- **`title`:** A human-readable title for the action (string)
- **`description`:** A detailed description of what the action does (string)
- **`schema`:** Object containing schema definitions
  - **`input`:** Function that returns a Zod schema for validating input
  - **`output`:** Function that returns a Zod schema for validating output
  - **`secrets`:** (optional) Function that returns a Zod schema for validating secrets. See [Secrets](#secrets) below.
- **`action`:** The async function that executes the action logic

### Optional Properties

- **`visibilityPermission`:** A `BasicPermission` that controls visibility and access to the action through the permissions framework. See [Permissions](#permissions) below.
- **`ui`:** A React component and optional browser security metadata that clients can use to render an interactive interface for the action. See [Action UIs](#action-uis) below.
- **`attributes`:** Object containing behavioral flags:
  - **`destructive`:** Boolean indicating if the action modifies or deletes data
  - **`idempotent`:** Boolean indicating if running the action multiple times produces the same result
  - **`readOnly`:** Boolean indicating if the action only reads data without modifications

### Action Context

When an action is executed, it receives a context object (`ActionsRegistryActionContext`) containing:

- **`input`:** The validated input data matching the defined input schema
- **`secrets`:** The validated secrets data matching the defined secrets schema, or `undefined` if no secrets schema is declared
- **`logger`:** A LoggerService instance for logging within the action
- **`credentials`:** BackstageCredentials for authentication and authorization
- **`signal`:** An optional abort signal that is triggered when the caller cancels the action invocation

## Action UIs

Backend plugins can attach a React UI to an action. Hosts that support action
UIs can render the component while the action runs, while other callers keep
using the same input, output, and handler without rendering anything.

Declare the component with a literal dynamic import so the package build can
discover it and produce a self-contained browser resource:

```tsx
actionsRegistry.register({
  name: 'show-example',
  title: 'Show example',
  description: 'Returns an example result',
  schema: {
    input: z => z.object({}),
    output: z => z.object({ value: z.string() }),
  },
  ui: {
    component: () => import('./ExampleUi').then(module => module.ExampleUi),
    permissions: { clipboardWrite: {} },
  },
  action: async () => ({ output: { value: 'example' } }),
});
```

The component is built automatically for packages with the
`backend-plugin` or `backend-plugin-module` role. The loader must use the form
shown above so the build can resolve it statically. The component runs in the
host's sandboxed browser environment and should use the host integration API
provided by that environment rather than backend-only APIs.

The optional `csp` and `permissions` fields declare the browser capabilities
the UI needs. The owning plugin's external origin is added automatically to
the UI's allowed connection domains. The optional `visibility` field controls
whether an action is advertised to models, apps, or both.

## Using the Service

### Registering an Action

Here's an example of how to register an action with the Actions Registry Service:

```typescript
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';

export function registerMyActions(actionsRegistry: ActionsRegistryService) {
  // Register a simple read-only action
  actionsRegistry.register({
    name: 'fetch-user-info',
    title: 'Fetch User Information',
    description: 'Retrieves user information from the catalog',
    schema: {
      input: z =>
        z.object({
          userRef: z.string(),
          includeGroups: z.boolean().optional(),
        }),
      output: z =>
        z.object({
          user: z.object({
            name: z.string(),
            email: z.string(),
            groups: z.array(z.string()).optional(),
          }),
        }),
    },
    attributes: {
      readOnly: true,
      idempotent: true,
    },
    action: async ({ input, logger, credentials }) => {
      logger.info(`Fetching user info for ${input.userRef}`);

      // Perform the action logic here
      const user = await fetchUserFromCatalog(input.userRef, credentials);

      return {
        output: {
          user: {
            name: user.name,
            email: user.email,
            groups: input.includeGroups ? user.groups : undefined,
          },
        },
      };
    },
  });

  // Register a destructive action
  actionsRegistry.register({
    name: 'delete-entity',
    title: 'Delete Entity',
    description: 'Removes an entity from the catalog',
    schema: {
      input: z =>
        z.object({
          entityRef: z.string(),
          force: z.boolean().optional(),
        }),
      output: z =>
        z.object({
          deletedEntities: z.array(z.string()),
        }),
    },
    attributes: {
      destructive: true,
      idempotent: false,
    },
    action: async ({ input, logger, credentials }) => {
      logger.warn(`Deleting entity ${input.entityRef}`);

      // Perform the deletion logic here
      const { deletedEntities } = await deleteEntityFromCatalog(
        input.entityRef,
        input.force,
        credentials,
      );

      return {
        output: deletedEntities,
      };
    },
  });
}
```

### Accessing the Service in a Plugin

To use the Actions Registry Service in your plugin, access it through dependency injection:

```typescript
import {
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';

export const myPlugin = createBackendPlugin({
  pluginId: 'my-plugin',
  register(env) {
    env.registerInit({
      deps: {
        actionsRegistry: actionsRegistryServiceRef,
        logger: coreServices.logger,
      },
      async init({ actionsRegistry, logger }) {
        logger.info('Registering actions...');
        registerMyActions(actionsRegistry);
        logger.info('Actions registered successfully');
      },
    });
  },
});
```

## Permissions

Actions can optionally declare a `visibilityPermission` to control visibility and access through the Backstage permissions framework. The `visibilityPermission` must be a `BasicPermission` (not a resource permission). When set, the action is only visible in listings and accessible by callers who are authorized.

When accessed via the Actions Service or the `/.backstage/actions/v1/...` HTTP endpoints, actions that are denied by the permission policy are filtered from list results and return a `404 Not Found` on invocation, as if they don't exist.

Permissions declared on actions are automatically registered with the `PermissionsRegistryService` so they appear in the permission policy system.

### Discovering action capability

Backend services can determine whether a plugin has registered actions by
requesting `GET /.backstage/actions/v1/status` from that plugin with service
credentials. The response contains a `hasActions` boolean.

The status reflects whether the plugin has registered any actions. It does not
depend on `backend.actions.pluginSources`, `backend.actions.filter`, or
caller-specific visibility permissions and does not expose action metadata.
Only service principals can access this endpoint.

### Adding a Permission to an Action

```typescript
import { createPermission } from '@backstage/plugin-permission-common';

// Define a permission for your action
const myDeletePermission = createPermission({
  name: 'my-plugin.actions.deleteEntity',
  attributes: { action: 'delete' },
});

actionsRegistry.register({
  name: 'delete-entity',
  title: 'Delete Entity',
  description: 'Removes an entity from the catalog',
  visibilityPermission: myDeletePermission,
  schema: {
    input: z => z.object({ entityRef: z.string() }),
    output: z => z.object({ deleted: z.boolean() }),
  },
  action: async ({ input }) => {
    // action logic
    return { output: { deleted: true } };
  },
});
```

Actions without a `visibilityPermission` field remain visible and accessible by all callers, preserving backwards compatibility.

## Secrets

Actions can declare a `secrets` schema to request external credentials from the end user, such as API tokens, personal access tokens, or other sensitive values that are not part of Backstage's own authentication system. Secrets are kept separate from the input schema so they never appear in tool definitions or LLM context when actions are exposed as MCP tools.

### Declaring a Secrets Schema

Add a `secrets` function to the `schema` object alongside `input` and `output`. It works the same way as the input schema, receiving the Zod instance and returning a Zod object schema:

```typescript
actionsRegistry.register({
  name: 'create-issue',
  title: 'Create GitHub Issue',
  description: 'Creates an issue in a GitHub repository',
  schema: {
    input: z =>
      z.object({
        repo: z.string(),
        title: z.string(),
        body: z.string().optional(),
      }),
    output: z =>
      z.object({
        issueUrl: z.string(),
      }),
    secrets: z =>
      z.object({
        githubToken: z
          .string()
          .describe('GitHub Personal Access Token with repo scope'),
      }),
  },
  attributes: {
    destructive: false,
  },
  action: async ({ input, secrets, credentials }) => {
    const octokit = new Octokit({ auth: secrets.githubToken });

    const { data } = await octokit.issues.create({
      owner: input.repo.split('/')[0],
      repo: input.repo.split('/')[1],
      title: input.title,
      body: input.body,
    });

    return { output: { issueUrl: data.html_url } };
  },
});
```

The `secrets` field in the action context is fully typed based on the declared schema. Actions without a `secrets` schema receive `undefined` for the `secrets` field.

### How Secrets Flow Through the System

Secrets are validated against the Zod schema the same way input is validated. If secrets are required but not provided, or if they fail validation, the action returns an `InputError`. If secrets are provided to an action that does not declare a secrets schema, the request is also rejected.

The secrets schema is included in the action metadata returned by the list endpoint, so callers can discover which secrets an action requires before invoking it.

## Best Practices

### Naming Conventions

- **Use kebab-case:** Action names should be in kebab-case (e.g., `fetch-user-info`, `create-repository`)
- **Be Descriptive:** Choose names that clearly describe what the action does
- **Avoid Redundancy:** Don't include plugin names in action names since the plugin context is separate
- **Use Verbs:** Start action names with verbs that describe the operation (e.g., `fetch`, `create`, `delete`, `update`)

## Error Handling

Use error classes from `@backstage/errors` when an action encounters a problem. These errors are recognized by the Actions Service and by consumers such as the [MCP Actions Backend](../../ai/mcp-actions.md), which surface the error message to callers. Unrecognized error types may result in a generic `500 Server Error`.

```ts
import { NotFoundError, NotAllowedError } from '@backstage/errors';

actionsRegistry.register({
  name: 'update-resource',
  title: 'Update Resource',
  description: 'Updates a resource by ID',
  schema: {
    input: z => z.object({ id: z.string() }),
    output: z => z.object({ updated: z.boolean() }),
  },
  attributes: { destructive: false, readOnly: false, idempotent: true },
  action: async ({ input, credentials }) => {
    const resource = await getResource(input.id);

    if (!resource) {
      throw new NotFoundError(`Resource ${input.id} not found`);
    }

    if (!hasPermission(credentials, resource)) {
      throw new NotAllowedError(
        `Insufficient permissions for resource ${input.id}`,
      );
    }

    await updateResource(resource);
    return { output: { updated: true } };
  },
});
```

## Action Attributes Reference

| Attribute     | Type    | Default                                | Description                                                         |
| ------------- | ------- | -------------------------------------- | ------------------------------------------------------------------- |
| `destructive` | boolean | `false` if read-only, otherwise `true` | Indicates the action modifies or deletes data. Use with caution.    |
| `idempotent`  | boolean | `false`                                | Indicates the action can be run multiple times with the same result |
| `readOnly`    | boolean | `false`                                | Indicates the action only reads data without making modifications   |

These attributes help consumers of actions understand their behavior and implement appropriate safeguards, retries, or optimizations based on the action's characteristics.
