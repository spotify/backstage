# Rollbar Plugin

Website: [https://rollbar.com/](https://rollbar.com/)

## Setup

1. Configure the [rollbar backend plugin](https://github.com/backstage/backstage/tree/master/plugins/rollbar-backend/README.md)

2. If you have standalone app (you didn't clone this repo), then do

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-rollbar
```

3. Add to the app `EntityPage` component:

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import { EntityRollbarContent } from '@backstage/plugin-rollbar';

const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route path="/rollbar" title="Rollbar">
      <EntityRollbarContent />
    </EntityLayout.Route>
```

4. Setup the `app-config.yaml` and account token environment variable

```yaml
# app.config.yaml
rollbar:
  organization: organization-name
  # used by rollbar-backend
  accountToken: ${ROLLBAR_ACCOUNT_TOKEN}
```

5. Annotate entities with the rollbar project slug

```yaml
# pump-station-catalog-component.yaml
# ...
metadata:
  annotations:
    rollbar.com/project-slug: organization-name/project-name
    # -- or just ---
    rollbar.com/project-slug: project-name
```

6. Run app with `yarn start` and navigate to `/rollbar` or a catalog entity

## Features

- List rollbar entities that are annotated with `rollbar.com/project-slug`
- View top active items for each rollbar annotated entity

## Limitations

- Rollbar has rate limits per token

## Links

- [Backend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/rollbar-backend)
- [The Backstage homepage](https://backstage.io)
