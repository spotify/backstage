# @backstage/plugin-ilert

## Introduction

[iLert](https://www.ilert.com) is a platform for alerting, on-call management and uptime monitoring. It helps teams to reduce response times to critical incidents by extending monitoring tools with reliable alerting, automatic escalations, on-call schedules and other features to support the incident response process, such as informing stakeholders or creating tickets in external incident management tools.

## Overview

This plugin gives an overview about ongoing iLert incidents, on-call and uptime monitor status.
See who is on-call, which incidents are active and trigger incidents directly from backstage for the configured alert sources.

In detail this plugin provides:

- Information details about the person on-call (all escalation levels of the current time)
- A way to override the current on-call person
- A list of active incidents
- A way to trigger a new incident
- A way to reassign/acknowledge/resolve an incident
- A way to trigger an incident action
- A way to trigger an immediate maintenance
- A way to disable/enable an alert source
- A list of uptime monitors

## Setup instructions

Install the plugin:

```bash
# From the Backstage repository root
cd packages/app
yarn add @backstage/plugin-ilert
```

Add it to the `EntityPage.tsx`:

```ts
import {
  isPluginApplicableToEntity as isILertAvailable,
  EntityILertCard,
} from '@backstage/plugin-ilert';

// ...
<EntitySwitch>
  <EntitySwitch.Case if={isILertAvailable}>
    <Grid item sm={6}>
      <EntityILertCard />
    </Grid>
  </EntitySwitch.Case>
</EntitySwitch>;
// ...
```

> To force an iLert card for each entity just add the `<EntityILertCard />` component. An instruction card will appear if no integration key is set.

## Add iLert explorer to the app sidebar

Modify your app routes in [`App.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/App.tsx) to include the Router component exported by the plugin - for example:

```tsx
import { ILertPage } from '@backstage/plugin-ilert';
<FlatRoutes>
  // ...
  <Route path="/ilert" element={<ILertPage />} />
  // ...
</FlatRoutes>;
```

Modify your sidebar in [`Root.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/Root/Root.tsx) to include the icon component exported by the plugin - for example:

```tsx
import { ILertIcon } from '@backstage/plugin-ilert';
<Sidebar>
  // ...
  <SidebarItem icon={ILertIcon} to="ilert" text="iLert" />
  // ...
</Sidebar>;
```

## Client configuration

If you want to override the default URL for api calls and detail pages, you can add it to `app-config.yaml`.

In `app-config.yaml`:

```yaml
ilert:
  baseUrl: https://my-org.ilert.com/
```

## Providing the Authorization Header

In order to make the API calls, you need to provide a new proxy config which will redirect to the [iLert API](https://api.ilert.com/api-docs/) endpoint. It needs an [Authorization Header](https://api.ilert.com/api-docs/#section/Authentication).

Add the proxy configuration in `app-config.yaml`

```yaml
proxy:
  ...
  '/ilert':
    target: https://api.ilert.com
    allowedMethods: ['GET', 'POST', 'PUT']
    allowedHeaders: ['Authorization']
    headers:
      Authorization: ${ILERT_AUTH_HEADER}
```

Then start the backend, passing the authorization header (bearer token or basic auth) as environment variable:

```bash
$ ILERT_AUTH_HEADER='<ILERT_AUTH>' yarn start
```

## Integration Key

The information displayed for each entity is based on the alert source integration key.

### Adding the integration key to the entity annotation

If you want to use this plugin for an entity, you need to label it with the below annotation:

```yml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  annotations:
    ilert.com/integration-key: [INTEGRATION_KEY]
```
