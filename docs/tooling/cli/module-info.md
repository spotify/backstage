---
id: module-info
title: Info Module
description: CLI command for displaying environment and dependency information.
---

The info module (`@backstage/cli-module-info`) provides a command for outputting
debug information about your Backstage setup, useful when opening issues or
troubleshooting.

## info

Outputs debug information which is useful when opening an issue. Outputs system
information, Node.js and npm versions, CLI version and type (inside Backstage
repo or a created app), all `@backstage/*` package dependency versions, and any
packages that contain a `backstage` field in their `package.json`.

The command distinguishes between installed packages (from npm) and local
workspace packages, making it easier to understand your Backstage setup.

```text
Usage: backstage-cli info [options]

Options:
  --include <patterns...>  Glob patterns for additional packages to include
                           (e.g., @mycompany/backstage-*)
  --format <text|json>     Output format (default: text)
  -h, --help               display help for command
```

### Examples

Output debug information to the console:

```bash
yarn backstage-cli info
```

Include additional packages matching a glob pattern:

```bash
yarn backstage-cli info --include "@mycompany/*"
```

Output as JSON:

```bash
yarn backstage-cli info --format json
```

Export JSON to a file for further processing:

```bash
yarn backstage-cli info --format json > backstage-info.json
```

Combine options to include custom packages and export to JSON:

```bash
yarn backstage-cli info --include "@mycompany/backstage-*" --include "@internal/*" --format json > debug-info.json
```

### JSON output format

When using `--format json`, the output is structured as follows:

```json
{
  "system": {
    "os": "Darwin 23.0.0 - darwin/arm64",
    "node": "v18.17.0",
    "yarn": "3.6.0",
    "packageManager": { "name": "yarn", "version": "3.6.0" },
    "cli": { "version": "0.27.0", "local": false },
    "backstage": "1.20.0"
  },
  "dependencies": {
    "@backstage/core-plugin-api": "1.8.0",
    "@backstage/plugin-catalog": "1.15.0"
  },
  "local": {
    "@mycompany/backstage-plugin-custom": "0.1.0"
  }
}
```

The `packageManager` field names the package manager of the project and its version. The `yarn` field is only present in Yarn projects, and is kept for existing consumers of the output.
