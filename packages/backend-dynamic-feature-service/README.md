# @backstage/backend-dynamic-feature-service

This package provides experimental support for **dynamic backend features (plugins and modules)** in Backstage, allowing you to load plugins at runtime from a separate directory without including them in your main application's package.json.

## Purpose

This enables:

- **Plugin distribution**: Distributing plugins as standalone artifacts
- **Runtime flexibility**: Adding or updating plugins without rebuilding the entire application
- **Isolation**: Keeping plugin-specific dependencies separate from core application dependencies
- **Modular deployments**: Different environments can load different sets of plugins

**Important:** This service handles loading only - packaging and distribution are separate concerns with multiple approaches available (see Packaging Approaches section).

## Related Packages

- **`@backstage/frontend-dynamic-feature-loader`**: Companion package for loading dynamic frontend plugins. This is **only** supported in the New Frontend System. For more details, checkout the [README](../frontend-dynamic-feature-loader/README.md).

## How it works

### Core Architecture

The service consists of several key components:

1. **Plugin Scanner**: Scans a configured directory (`dynamicPlugins.rootDirectory`) for plugin packages
2. **Module Loader**: Loads plugin modules
3. **Feature Loader**: Integrates loaded plugins into the Backstage backend system
4. **Frontend Asset Server**: Serves frontend plugin assets (JavaScript, CSS, manifests) over HTTP for dynamic frontend plugins

### Loading Process

1. **Discovery**: The scanner identifies valid plugin packages in the dynamic plugins root directory
2. **Validation**: Each package is validated for required fields (`main`, `backstage.role`)
3. **Loading**: The module loader loads the plugin code
4. **Integration**: Plugins are registered as Backstage features and made available to the backend

### Module Resolution

A backend dynamic plugin resolves modules from its own `node_modules` first, then from the `node_modules` of the Backstage root, and then from the global folders of Node.js, which start with the directories in `NODE_PATH`. Plugins outside of the Backstage root reach the root `node_modules` through `NODE_PATH`, so for them the order of `NODE_PATH` applies. Modules that are not found in these places are resolved from the host backend, through the `node_modules` directories of the backend package and of this package within the Backstage root. This lets a plugin load the packages it shares with the host when the package manager does not link them into the root `node_modules`, as with the pnpm `isolated` node linker. With the default pnpm hoisting, this includes the packages that pnpm hoists into `node_modules/.pnpm/node_modules`. With `hoist: false`, only the direct dependencies of the backend package and of this package are found.

## Usage

### Basic Setup

Add the service to your backend application:

1. **Install the package**:

```bash
yarn add @backstage/backend-dynamic-feature-service
```

2. **Add one line to your backend**:

```ts
import { createBackend } from '@backstage/backend-defaults';
import { dynamicPluginsFeatureLoader } from '@backstage/backend-dynamic-feature-service';

const backend = createBackend();
// Add this line to enable dynamic plugin support:
backend.add(dynamicPluginsFeatureLoader);
// ... your other plugins
backend.start();
```

### Configuration

Configure the dynamic plugins directory in your `app-config.yaml`:

```yaml
dynamicPlugins:
  rootDirectory: dynamic-plugins-root
```

## Dynamic Plugin Packaging

### Package Structure Requirements

Before exploring specific packaging approaches, it's important to understand what constitutes a valid dynamic plugin package. Dynamic plugins follow the basic rules of Node.js packages, including:

**Package contents:**

- **package.json**: Package metadata and configuration
- **JavaScript files**: Either loadable by the Node.js CommonJS module loaders for backend plugins, or RSPack/webpack assets for frontend plugins
- **Configuration schema** (optional): JSON schema file (typically `dist/.config-schema.json`) for plugin configuration validation
- **Private dependencies** (optional): Embedded `node_modules` folder containing private dependencies for backend plugins

**Required package.json fields:**

- `name`: Package identifier
- `version`: Package version
- `main`: Entry point to the plugin's JavaScript code
- `backstage.role`: Must be set to `"backend-plugin"` or `"backend-plugin-module"`

### Packaging Approaches

Since this service only handles loading, you would choose a packaging approach based on your plugin's dependencies:

### 1. Simple npm pack

**When to use:** Plugin only uses dependencies that are already provided by the main Backstage application.

**How to use:**

```bash
cd my-backstage-plugin
yarn pack
# Results in: package.tgz

# Extract to dynamic plugins directory
mkdir -p /path/to/dynamic-plugins-root/my-backstage-plugin
tar -xzf package.tgz -C /path/to/dynamic-plugins-root/my-backstage-plugin --strip-components=1
```

**Why this works:** The plugin can resolve all its dependencies from the main application. See [Module Resolution](#module-resolution).

**Reality:** Most plugins have private dependencies not available in the main application, so this approach has limited applicability.

### 2. Manual packaging with dependency installation

**When to use:** Plugin has private dependencies not available in the main Backstage application.

**How to use:**

```bash
# Package the plugin
cd my-backstage-plugin
yarn pack

# Extract and install dependencies
mkdir -p /path/to/dynamic-plugins-root/my-backstage-plugin
tar -xzf package.tgz -C /path/to/dynamic-plugin-root/my-backstage-plugin --strip-components=1
cp yarn.lock /path/to/dynamic-plugin-root/my-backstage-plugin
cd /path/to/dynamic-plugins-root/my-backstage-plugin
yarn install  # Installs all the plugin's dependencies
```

**Why this works:** Each plugin gets its own `node_modules` directory with all its dependencies.

**Example scenario:** Plugin needs `axios@1.4.0` which isn't available in the main application.

### 3. Dedicated bundling CLI command

**When to use:**

- When you want to produce self-contained dynamic plugin packages that can be directly extracted and loaded without any post-action,
- especially when your plugin depends on other packages in the same monorepo.

**How to use:**

The [`backstage-cli package bundle`](../cli/cli-report.md) command automates the required steps. Run it from within a plugin directory:

```bash
cd my-backstage-plugin
yarn backstage-cli package bundle --output-destination /path/to/dynamic-plugins-root
# Creates a self-contained bundle in the /path/to/dynamic-plugins-root/my-backstage-plugin/ sub-folder
```

**Batch bundling:** When bundling many plugins from the same monorepo, use `--pre-packed-dir` to avoid redundant work:

```bash
# First, build a shared dist workspace
backstage-cli build-workspace dist-workspace --alwaysPack ...plugin-packages

# Then bundle each plugin using the pre-packed output
cd plugins/my-backstage-plugin
backstage-cli package bundle --pre-packed-dir ../../dist-workspace
```

See the full list of options in the [CLI reference](../cli/cli-report.md).

**What the command does:**

1. **Builds the plugin** — Produces CJS output for the backend plugin and its transitively-required monorepo packages (`*-node` or `*-common`)
2. **Packs local packages** — Resolves `workspace:^` and `backstage:^` dependencies on both the main plugin package and its transitively-required monorepo packages (`*-node` or `*-common`)
3. **Installs private dependencies** — Seeds a lockfile from the plugin source monorepo and prunes it, then installs a private `node_modules` containing all required dependencies
4. **Collects configuration schemas** — Gathers plugin config schemas and writes them to `dist/.config-schema.json` so they are available for validation at load time

**Benefits:**

- Self-contained packages with all necessary dependencies
- No post-installation steps required (extract and run)
- Consistent dependency structure across all dynamic plugins
- Automatic configuration schema collection
- Production-ready distribution format
