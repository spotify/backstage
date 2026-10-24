# @backstage/cli-module-new

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.6-next.0

## 0.1.8

### Patch Changes

- e4597ce: Updated the `plugin-web-library` template to use `@backstage/ui` instead of the deprecated `@material-ui/core`.
- b717df2: Switched to version 4 of `zod` for internal validation. Validation errors for invalid templates now use the updated, more descriptive `zod` wording.
- Updated dependencies
  - @backstage/cli-node@0.3.5
  - @backstage/errors@1.3.2
  - @backstage/cli-common@0.3.2

## 0.1.8-next.1

### Patch Changes

- e4597ce: Updated the `plugin-web-library` template to use `@backstage/ui` instead of the deprecated `@material-ui/core`.

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.5-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/cli-common@0.3.2-next.0

## 0.1.7

### Patch Changes

- 33c8190: Updated the frontend plugin templates to use MSW 2 for generated tests.
- 4cba335: Fixes published entry point configurations so it can be imported reliably in Jest/Node resolution.
- Updated dependencies
  - @backstage/cli-common@0.3.1

## 0.1.7-next.0

### Patch Changes

- 4cba335: Fixes published entry point configurations so it can be imported reliably in Jest/Node resolution.

## 0.1.6

### Patch Changes

- 90ef477: Added a new `permission-policy-module` template for scaffolding custom permission policies via `backstage-cli new`. The template generates a backend module that wires a `PermissionPolicy` implementation into the permission backend using the `policyExtensionPoint`, along with a test example.
- 88b2bbf: Added a `search-collator-module` template for scaffolding new search collator modules via `backstage-cli new`.
- 2c7cc55: Added a new `catalog-processor-module` template for scaffolding catalog processor modules via `backstage-cli new`.
- 8ccc09b: Fixed `yarn new` failing with "No version available" for several templates by adding missing packages to the version map.
- 0e6007f: Updated the `plugin-web-library` template to use `toastApiRef` from `@backstage/frontend-plugin-api` instead of the deprecated `alertApiRef` from `@backstage/core-plugin-api`.
- 90bbc2e: Added `UserInfoService` to the `permission-policy-module` template so that scaffolded permission policies have the service already wired up for ownership lookups.
- 10887f4: Fixed generated frontend plugin tables to identify their row header, and added the associated backend plugin package as a development dependency of generated backend plugin modules.

## 0.1.6-next.0

### Patch Changes

- 90ef477: Added a new `permission-policy-module` template for scaffolding custom permission policies via `backstage-cli new`. The template generates a backend module that wires a `PermissionPolicy` implementation into the permission backend using the `policyExtensionPoint`, along with a test example.
- 88b2bbf: Added a `search-collator-module` template for scaffolding new search collator modules via `backstage-cli new`.
- 2c7cc55: Added a new `catalog-processor-module` template for scaffolding catalog processor modules via `backstage-cli new`.
- 0e6007f: Updated the `plugin-web-library` template to use `toastApiRef` from `@backstage/frontend-plugin-api` instead of the deprecated `alertApiRef` from `@backstage/core-plugin-api`.
- 90bbc2e: Added `UserInfoService` to the `permission-policy-module` template so that scaffolded permission policies have the service already wired up for ownership lookups.
- 10887f4: Fixed generated frontend plugin tables to identify their row header, and added the associated backend plugin package as a development dependency of generated backend plugin modules.

## 0.1.5

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages
- Updated dependencies
  - @backstage/cli-common@0.3.0
  - @backstage/cli-node@0.3.4

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.3.0-next.0
  - @backstage/cli-node@0.3.4-next.0

## 0.1.5-next.0

### Patch Changes

- 28c1c1c: Synced zod-validation-error versions between packages

## 0.1.4

### Patch Changes

- 4014819: Added a new `scaffolder-field-extension-module` template for scaffolding custom Scaffolder form field extensions via `backstage-cli new`.
- 696c78c: The `--help` output for commands now shows a generated usage line that lists the available flags and any positional arguments the command accepts.
- 2e6ffe6: Updated the standalone CLI executable to use the new CLI module runner.
- Updated dependencies
  - @backstage/cli-node@0.3.3

## 0.1.4-next.0

### Patch Changes

- 4014819: Added a new `scaffolder-field-extension-module` template for scaffolding custom Scaffolder form field extensions via `backstage-cli new`.

## 0.1.3

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/errors@1.3.1
  - @backstage/cli-node@0.3.2
  - @backstage/cli-common@0.2.2

## 0.1.3-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/cli-node@0.3.2-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/cli-common@0.2.2-next.0
  - @backstage/cli-node@0.3.2-next.0

## 0.1.2

### Patch Changes

- 64a91d0: Rename the legacy `frontend-plugin` to `frontend-plugin-legacy`
- 482ceed: Migrated from `assertError` to `toError` for error handling.
- 2b4f97a: Updated frontend-plugin template to provide a todo list visualization compatible with the backend plugin.
- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-common@0.2.1
  - @backstage/cli-node@0.3.1

## 0.1.2-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1

## 0.1.1-next.1

### Patch Changes

- 64a91d0: Rename the legacy `frontend-plugin` to `frontend-plugin-legacy`

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- edf2b77: Added support for the `cli-module` template role for scaffolding new CLI module packages.
- ea90ab0: The built-in `yarn new` templates have been moved to this package from `@backstage/cli`. The default template references have been updated from `@backstage/cli/templates/*` to `@backstage/cli-module-new/templates/*`. Existing references to `@backstage/cli/templates/*` in your root `package.json` will continue to work through a backwards compatibility rewrite.
- ebeb0d4: Updated the new frontend plugin template to use `@backstage/frontend-dev-utils` in its `dev/` entry point instead of wiring `createApp` manually. Generated plugins now get the same dev app helper setup as the built-in examples.
- 971cc94: The `new` command now prompts for the plugin package name when creating plugin modules, in order to properly populate the `package.json` file.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
