---
id: discovery
title: GitHub Discovery
sidebar_label: Discovery
description: Automatically discovering catalog entities from repositories in a GitHub organization or App
---

## GitHub Provider

The GitHub integration has a discovery provider for discovering catalog
entities within a GitHub organization or App. The provider will crawl the GitHub
organization or App and register entities matching the configured path. This can be
useful as an alternative to static locations or manually adding things to the
catalog. This is the preferred method for ingesting entities into the catalog.

## Installation

You will have to add the GitHub Entity provider to your backend as it is not installed by default, therefore you have to add a
dependency on `@backstage/plugin-catalog-backend-module-github` to your backend
package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-github
```

And then update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-github'));
```

## Events Support

The catalog module for GitHub comes with events support enabled. This will make it subscribe to its relevant topics (`github.push`, `github.repository`) and expects these events to be published via the `EventsService`.

### Prerequisites

There are two Prerequisites to use the builtin events support:

1. Creating a webhook in GitHub
2. Installing and configuring `@backstage/plugin-events-backend-module-github`

#### Configure Webhooks in GitHub

You can check the official docs to [configure your webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks) and to [secure your request](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks).

The webhook(s) will need to be configured to react to `push` and `repository` events.

:::note

To receive the `repository.transferred` event, the new owner account must have the GitHub App installed, and the App must be subscribed to `repository` events. This event is only sent to the account where the ownership is transferred.

:::

When creating the webhook in GitHub the "Payload URL" will looks something along these lines: `https://<your-instance-name>/api/events/http/github` and the "Content Type" should be `application/json`.

The GitHub Webhooks UI will send a trial event to validate it can connect when you save your new Webhook. It is possible to retry this trial event if it fails and you want to send it again. Additionally there is a Recent Deliveries tab you can use to validate that the events are being fired should you need to do any later troubleshooting.

#### Install and Configure GitHub Events Module

In order to use the built-in events support you'll need to install and configure `@backstage/plugin-events-backend-module-github`. This module will route received events from the generic topic `github` to more specific ones based on the event type (e.g., `github.push`). These more specific events are what the builtin events support is expecting.

First we need to add the package:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-github
```

Then we need to add it to your backend:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-events-backend-module-github'));
/* highlight-add-end */
```

Finally you will want to configure it:

```yaml title="app-config.yaml
events:
  modules:
    github:
      webhookSecret: ${GITHUB_WEBHOOK_SECRET}
```

Though this last step is technically optional, you'll want to include it to be sure the events being received are from GitHub and not from an external bad actor.

The value of `${GITHUB_WEBHOOK_SECRET}` in this example would be the same that you used when creating the webhook on GitHub.

### Events Setup using HTTP endpoint

Using the HTTP endpoint for events just requires adding some additional configuration to your `app-config.yaml` as it is a built in feature of the Events backend, here's what that would look like:

```yaml title="app-config.yaml
events:
  http:
    topics:
      - github
```

This will then expose an endpoint like this: <http://localhost/api/events/http/github>

### Events Setup using AWS SQS module

Alternatively to using the HTTP endpoint you can use the AWS SQS module, here's how.

First we need to add the package:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugins-events-backend-module-aws-sqs
```

Then we need to add it to your backend:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-events-backend-module-github'));
/* highlight-add-start */
backend.add(import('@backstage/plugins-events-backend-module-aws-sqs'));
/* highlight-add-end */
```

Finally you will want to configure it:

```yaml title="app-config.yaml
events:
  modules:
    awsSqs:
      awsSqsConsumingEventPublisher:
        topics:
          github:
            queue:
              url: 'https://sqs.us-east-2.amazonaws.com/123456789012/MyQueue'
              region: us-east-2
```

The [AWS SQS module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-aws-sqs/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

### Events Setup using Google Pub/Sub module

Alternatively to using the HTTP endpoint you can use the Google Pub/Sub module, here's how.

First we need to add the package:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-google-pubsub
```

Then we need to add it to your backend:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-events-backend-module-github'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-events-backend-module-google-pubsub'));
/* highlight-add-end */
```

Finally you will want to configure it:

```yaml title="app-config.yaml
events:
  modules:
    googlePubSub:
      googlePubSubConsumingEventPublisher:
        subscriptions:
          # A unique key for your subscription, to be used in logging and metrics
          mySubscription:
            # The fully qualified name of the subscription
            subscriptionName: 'projects/my-google-project/subscriptions/github-enterprise-events'
            # The event system topic to transfer to. This can also be just a plain string
            targetTopic: 'github.{{ event.attributes.x-github-event }}'
```

The [Google Pub/Sub module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-google-pubsub/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

### Events Setup using Kafka module

Alternatively to using the HTTP endpoint you can use the Kafka module, here's how.

First we need to add the package:

```bash title="from your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-events-backend-module-kafka
```

Then we need to add it to your backend:

```ts title="in packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-events-backend-module-github'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-events-backend-module-kafka'));
/* highlight-add-end */
```

Finally you will want to configure it:

```yaml title="app-config.yaml
events:
  modules:
    kafka:
      kafkaConsumingEventPublisher:
        # Client ID used by Backstage to identify when connecting to the Kafka cluster.
        clientId: your-client-id
        # List of brokers in the Kafka cluster to connect to.
        brokers:
          - broker1
          - broker2
        topics:
          # Replace with actual topic name as expected by subscribers
          - topic: 'backstage.topic'
            kafka:
              # The Kafka topics to subscribe to.
              topics:
                - topic1
              # The GroupId to be used by the topic consumers.
              groupId: your-group-id
```

The [Kafka module `README`](https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-kafka/README.md#configuration) has more details on the configuration options, the example above includes only the required options.

## Configuration

To use the discovery provider, you'll need a GitHub integration
[set up](locations.md) with either a [Personal Access Token](../../getting-started/config/authentication.md) or [GitHub Apps](./github-apps.md). For Personal Access Tokens you should pay attention to the [required scopes](https://backstage.io/docs/integrations/github/locations/#token-scopes), where you will need at least the `repo` scope for reading components. For GitHub Apps you will need to grant it the [required permissions](https://backstage.io/docs/integrations/github/github-apps#app-permissions) instead, where you will need at least the `Contents: Read-only` permissions for reading components.

Then you can add a `github` config to the catalog providers configuration:

```yaml
catalog:
  providers:
    github:
      # the provider ID can be any camelCase string
      providerId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
        schedule: # same options as in SchedulerServiceTaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
      customProviderId:
        organization: 'new-org' # string
        catalogPath: '/custom/path/catalog-info.yaml' # string
        filters: # optional filters
          branch: 'develop' # optional string
          repository: '.*' # optional Regex
        pageSizes:
          repositories: 25
        queryLimits:
          repositoryChunkSize: 5000
      wildcardProviderId:
        organization: 'new-org' # string
        catalogPath: '/groups/**/*.yaml' # this will search all folders for files that end in .yaml
        filters: # optional filters
          branch: 'develop' # optional string
          repository: '.*' # optional Regex
      topicProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
          topic: 'backstage-exclude' # optional string
      topicFilterProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
          topic:
            include: ['backstage-include'] # optional array of strings
            exclude: ['experiments'] # optional array of strings
      validateLocationsExist:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          branch: 'main' # string
          repository: '.*' # Regex
        validateLocationsExist: true # optional boolean
      visibilityProviderId:
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
        filters:
          visibility:
            - public
            - internal
      enterpriseProviderId:
        host: ghe.example.net
        organization: 'backstage' # string
        catalogPath: '/catalog-info.yaml' # string
```

This provider supports multiple organizations and apps via unique provider IDs.

:::note

It is possible but certainly not recommended to skip the provider ID level.
If you do so, `default` will be used as provider ID.

:::

- **`catalogPath`** _(optional)_:
  Default: `/catalog-info.yaml`.
  Path where to look for `catalog-info.yaml` files.
  You can use wildcards - `*`, `**` or a glob pattern supported by [`minimatch`](https://github.com/isaacs/minimatch) - to search the path and/or the filename.
  Wildcards cannot be used if the `validateLocationsExist` option is set to `true`.
- **`filters`** _(optional)_:
  - **`branch`** _(optional)_:
    String used to filter results based on the branch name. Branch name cannot have any slash (`/`) characters.
    Defaults to the default Branch of the repository.
  - **`repository`** _(optional)_:
    Regular expression used to filter results based on the repository name.
  - **`topic`** _(optional)_:
    Both of the filters below may be used at the same time but the exclusion filter has the highest priority.
    In the example above, a repository with the `backstage-include` topic would still be excluded
    if it were also carrying the `experiments` topic.
    - **`include`** _(optional)_:
      An array of strings used to filter in results based on their associated GitHub topics.
      If configured, only repositories with one (or more) topic(s) present in the inclusion filter will be ingested
    - **`exclude`** _(optional)_:
      An array of strings used to filter out results based on their associated GitHub topics.
      If configured, all repositories _except_ those with one (or more) topics(s) present in the exclusion filter will be ingested.
  - **`visibility`** _(optional)_:
    An array of strings used to filter results based on their visibility. Available options are `private`, `internal`, `public`. If configured (non empty), only repositories with visibility present in the filter will be ingested
  - **`allowArchived`** _(optional)_:
    Whether to include archived repositories. Defaults to `false`.
- **`host`** _(optional)_:
  The hostname of your GitHub Enterprise instance. It must match a host defined in [integrations.github](locations.md).
- **`organization`** _(required, unless `app` is set)_:
  Name of your organization account/workspace.
  If you want to add multiple organizations, you need to add one provider config each or specify `app` instead.
- **`app`** _(required, unless `organization` is set)_:
  ID of your GitHub App.
- **`validateLocationsExist`** _(optional)_:
  Whether to validate locations that exist before emitting them.
  This option avoids generating locations for catalog info files that do not exist in the source repository.
  Defaults to `false`.
  Due to limitations in the GitHub API's ability to query for repository objects, this option cannot be used in
  conjunction with wildcards in the `catalogPath`.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.
- **`pageSizes`** _(optional)_:
  Configure page sizes for GitHub GraphQL API queries. This can help prevent `RESOURCE_LIMITS_EXCEEDED` errors.
  - **`repositories`** _(optional)_:
    Number of repositories to fetch per page. Defaults to `25`. Reduce this value if hitting API resource limits.
- **`queryLimits`** _(optional)_: Configure limits for GitHub GraphQL API queries to make sure catalog jobs do not time out. This can happen if you have large organization and too many GraphQL request are executed in one session. Request headers timeout is 60 minutes, check if your jobs are reaching this limit.
  - **`repositoryChunkSize`**: Number of repositories to fetch per chunk in a GraphQL client session. Set this if you are getting 502 errors. It probably means you have more repositories than you are able to fetch in one session.
    (default: undefined - no chunking, fetch all repositories in one session)

## GitHub API Rate Limits

GitHub [rate limits](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting) API requests to 5,000 per hour (or more for Enterprise
accounts). The snippet below refreshes the Backstage catalog data every 35 minutes, which issues an API request for each discovered location.

If your requests are too frequent then you may get throttled by
rate limiting. You can change the refresh frequency of the catalog in your `app-config.yaml` file by controlling the `schedule`.

```yaml
schedule:
  frequency: { minutes: 35 }
  timeout: { minutes: 3 }
```

More information about scheduling can be found on the [SchedulerServiceTaskScheduleDefinition](https://backstage.io/api/stable/interfaces/_backstage_backend-plugin-api.index.SchedulerServiceTaskScheduleDefinition.html) page.

Alternatively, or additionally, you can configure [github-apps](github-apps.md) authentication
which carries a much higher rate limit at GitHub.

This is true for any method of adding GitHub entities to the catalog, but
especially easy to hit with automatic discovery.
