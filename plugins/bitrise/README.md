# Bitrise

Welcome to the Bitrise plugin!

- View recent Bitrise Builds for a Bitrise application
- Download build artifacts

## Installation

```sh
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-bitrise
```

Bitrise Plugin exposes an entity tab component named `EntityBitriseContent`. You can include it in the
[`EntityPage.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/catalog/EntityPage.tsx)`:

```tsx
// At the top imports
import { EntityBitriseContent } from '@backstage/plugin-bitrise';

// Farther down at the website declaration
const websiteEntityPage = (
  <EntityLayout>
    {/* Place the following section where you want the tab to appear */}
    <EntityLayout.Route path="/bitrise" title="Bitrise">
      <EntityBitriseContent />
    </EntityLayout.Route>
```

Now your plugin should be visible as a tab at the top of the entity pages,
specifically for components that are of the type `website`.
However, it warns of a missing `bitrise.io/app` annotation.

Add the annotation to your component [catalog-info.yaml](https://github.com/backstage/backstage/blob/master/catalog-info.yaml) as shown in the highlighted example below:

```yaml
metadata:
  annotations:
    bitrise.io/app: '<THE NAME OF THE BITRISE APP>'
```

The plugin requires to configure a Bitrise API proxy with a `BITRISE_AUTH_TOKEN` for authentication in the [app-config.yaml](https://github.com/backstage/backstage/blob/master/app-config.yaml):

```yaml
proxy:
  '/bitrise':
    target: 'https://api.bitrise.io/v0.1'
    allowedMethods: ['GET']
    headers:
      Authorization: ${BITRISE_AUTH_TOKEN}
```

Learn on https://devcenter.bitrise.io/api/authentication how to create a new Bitrise token.
