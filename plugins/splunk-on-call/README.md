# Splunk On-Call

## Overview

This plugin displays Splunk On-Call, formerly VictorOps, information about an entity.

There is a way to trigger an new incident directly to specific users or/and specific teams.

This plugin requires that entities are annotated with a team name. See more further down in this document.

This plugin provides:

- A list of incidents
- A way to trigger a new incident to specific users or/and teams
- A way to acknowledge/resolve an incident
- Information details about the persons on-call

## Setup instructions

Install the plugin:

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-splunk-on-call
```

Add it to your `EntityPage`:

```ts
// packages/app/src/components/catalog/EntityPage.tsx
import {
  isSplunkOnCallAvailable,
  EntitySplunkOnCallCard,
} from '@backstage/plugin-splunk-on-call';
// ...
const overviewContent = (
  <Grid container spacing={3} alignItems="stretch">
    <EntitySwitch>
      <EntitySwitch.Case if={isSplunkOnCallAvailable}>
        <Grid item md={6}>
          <EntitySplunkOnCallCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
```

## Client configuration

In order to be able to perform certain action (create-acknowledge-resolve an action), you need to provide a REST Endpoint.

To enable the REST Endpoint integration you can go on https://portal.victorops.com/ inside Integrations > 3rd Party Integrations > REST – Generic.
You can now copy the URL to notify: `<SPLUNK_ON_CALL_REST_ENDPOINT>/$routing_key`

In `app-config.yaml`:

```yaml
splunkOnCall:
  eventsRestEndpoint: <SPLUNK_ON_CALL_REST_ENDPOINT>
```

In order to make the API calls, you need to provide a new proxy config which will redirect to the Splunk On-Call API endpoint and add authentication information in the headers:

```yaml
# app-config.yaml
proxy:
  # ...
  '/splunk-on-call':
    target: https://api.victorops.com/api-public
    headers:
      X-VO-Api-Id: ${SPLUNK_ON_CALL_API_ID}
      X-VO-Api-Key: ${SPLUNK_ON_CALL_API_KEY}
```

In addition, to make certain API calls (trigger-resolve-acknowledge an incident) you need to add the `PATCH` method to the backend `cors` methods list: `[GET, POST, PUT, DELETE, PATCH]`.

### Adding your team name to the entity annotation

The information displayed for each entity is based on the team name.
If you want to use this plugin for an entity, you need to label it with the below annotation:

```yaml
annotations:
  splunk.com/on-call-team': <SPLUNK_ON_CALL_TEAM_NAME>
```

### Create the Routing Key

To be able to use the REST Endpoint seen above, you must have created a routing key with the **same name** as the provided team.

You can create a new routing key on https://portal.victorops.com/ by going to Settings > Routing Keys.

You can read [Create & Manage Alert Routing Keys](https://help.victorops.com/knowledge-base/routing-keys/#routing-key-tips-tricks) for further information.

## Providing the API key and API id

In order for the client to make requests to the [Splunk On-Call API](https://portal.victorops.com/public/api-docs.html#/) it needs an [API ID and an API Key](https://help.victorops.com/knowledge-base/api/).

Then start the backend passing the values as an environment variable:

```bash
$ SPLUNK_ON_CALL_API_KEY='' SPLUNK_ON_CALL_API_ID='' yarn start
```

This will proxy the request by adding `X-VO-Api-Id` and `X-VO-Api-Key` headers with the provided values.

You can also add the values in your helm template:

```yaml
# backend-secret.yaml
stringData:
  # ...
  SPLUNK_ON_CALL_API_ID: { { .Values.auth.splunkOnCallApiId } }
  SPLUNK_ON_CALL_API_KEY: { { .Values.auth.splunkOnCallApiKey } }
```

To enable it you need to provide them in the chart's values:

```yaml
# values.yaml
auth:
  # ...
  splunkOnCallApiId: h
  splunkOnCallApiKey: h
```
