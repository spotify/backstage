# @backstage/plugin-notifications-backend

## 0.6.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.6.10

### Patch Changes

- 8ba34e8: Persist notification payload metadata for user notifications and broadcasts, and return it when reading notifications. Re-sending a scoped notification replaces its metadata, or clears it when the new payload omits metadata.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/config@1.3.10
  - @backstage/errors@1.3.2
  - @backstage/backend-openapi-utils@0.7.3
  - @backstage/catalog-model@1.10.2
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-notifications-common@0.2.5
  - @backstage/plugin-notifications-node@0.2.31
  - @backstage/plugin-signals-node@0.2.6

## 0.6.10-next.2

### Patch Changes

- 8ba34e8: Persist notification payload metadata for user notifications and broadcasts, and return it when reading notifications. Re-sending a scoped notification replaces its metadata, or clears it when the new payload omits metadata.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.2

## 0.6.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/backend-openapi-utils@0.7.3-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-notifications-node@0.2.31-next.1
  - @backstage/plugin-signals-node@0.2.6-next.1

## 0.6.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/errors@1.3.2-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/backend-openapi-utils@0.7.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0
  - @backstage/plugin-signals-node@0.2.6-next.0

## 0.6.9

### Patch Changes

- 736d84e: Use locale-insensitive Unicode casing for consistent string handling across environments.
- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.2
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/plugin-notifications-node@0.2.30
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-notifications-common@0.2.4
  - @backstage/plugin-signals-node@0.2.5

## 0.6.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-notifications-node@0.2.30-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/plugin-notifications-common@0.2.4-next.0

## 0.6.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-notifications-node@0.2.30-next.0
  - @backstage/plugin-signals-node@0.2.5-next.0

## 0.6.8

### Patch Changes

- 3222945: Fixed notification recipient resolution to safely handle cyclic group relationships during group traversal, preventing endless recursion.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/backend-openapi-utils@0.7.1
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-notifications-node@0.2.29
  - @backstage/plugin-signals-node@0.2.4

## 0.6.8-next.1

### Patch Changes

- 3222945: Fixed notification recipient resolution to safely handle cyclic group relationships during group traversal, preventing endless recursion.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.1

## 0.6.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/backend-openapi-utils@0.7.1-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-notifications-node@0.2.29-next.0
  - @backstage/plugin-signals-node@0.2.4-next.0

## 0.6.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0
  - @backstage/plugin-notifications-node@0.2.28
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/plugin-catalog-node@2.2.3
  - @backstage/plugin-signals-node@0.2.3

## 0.6.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.7.0-next.1
  - @backstage/backend-plugin-api@1.9.3-next.1

## 0.6.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-notifications-node@0.2.28-next.0
  - @backstage/backend-openapi-utils@0.6.11-next.0
  - @backstage/plugin-signals-node@0.2.3-next.0

## 0.6.6

### Patch Changes

- ac410b1: Migrated the internal router to be generated from the plugin's OpenAPI specification. The HTTP API is unchanged.
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/backend-openapi-utils@0.6.10
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-notifications-node@0.2.27
  - @backstage/plugin-signals-node@0.2.2

## 0.6.6-next.0

### Patch Changes

- ac410b1: Migrated the internal router to be generated from the plugin's OpenAPI specification. The HTTP API is unchanged.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-notifications-node@0.2.27-next.0
  - @backstage/backend-openapi-utils@0.6.10-next.0
  - @backstage/plugin-signals-node@0.2.2-next.0

## 0.6.5

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/errors@1.3.1
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/plugin-notifications-common@0.2.3
  - @backstage/plugin-notifications-node@0.2.26
  - @backstage/plugin-signals-node@0.2.1
  - @backstage/config@1.3.8

## 0.6.5-next.1

### Patch Changes

- e9b78e9: Removed the `uuid` dependency and replaced usage with the built-in `crypto.randomUUID()`.
- Updated dependencies
  - @backstage/catalog-model@1.8.1-next.1
  - @backstage/plugin-catalog-node@2.2.1-next.1

## 0.6.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.1-next.0
  - @backstage/plugin-notifications-common@0.2.3-next.0
  - @backstage/plugin-notifications-node@0.2.26-next.0
  - @backstage/plugin-signals-node@0.2.1-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/types@1.2.2

## 0.6.4

### Patch Changes

- 4c1fd43: Added an action to get a user's notifications
- 070af42: Fix handling of `limit=0` in `getNotifications` query to return empty results instead of all notifications
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/errors@1.3.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/plugin-signals-node@0.2.0
  - @backstage/plugin-notifications-node@0.2.25
  - @backstage/config@1.3.7
  - @backstage/plugin-notifications-common@0.2.2

## 0.6.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/plugin-notifications-node@0.2.25-next.2
  - @backstage/plugin-notifications-common@0.2.2-next.0
  - @backstage/plugin-signals-node@0.1.30-next.2

## 0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-notifications-node@0.2.25-next.1
  - @backstage/plugin-signals-node@0.1.30-next.1

## 0.6.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-notifications-node@0.2.25-next.0
  - @backstage/plugin-signals-node@0.1.30-next.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.1

## 0.6.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-notifications-node@0.2.24
  - @backstage/plugin-signals-node@0.1.29

## 0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-notifications-node@0.2.24-next.2
  - @backstage/plugin-signals-node@0.1.29-next.1

## 0.6.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.1
  - @backstage/plugin-notifications-node@0.2.24-next.0
  - @backstage/plugin-signals-node@0.1.29-next.0

## 0.6.2

### Patch Changes

- 7455dae: Use node prefix on native imports
- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- e9eb400: Allow configuring included topics for email notifications.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/plugin-notifications-common@0.2.1
  - @backstage/plugin-notifications-node@0.2.23
  - @backstage/plugin-signals-node@0.1.28

## 0.6.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-notifications-node@0.2.23-next.1

## 0.6.2-next.1

### Patch Changes

- 5e3ef57: Added `peerModules` metadata declaring recommended modules for cross-plugin integrations.
- Updated dependencies
  - @backstage/backend-plugin-api@1.7.0-next.1

## 0.6.2-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports
- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-notifications-node@0.2.23-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/plugin-signals-node@0.1.28-next.0

## 0.6.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.27
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-notifications-node@0.2.22

## 0.6.1-next.1

### Patch Changes

- de96a60: chore(deps): bump `express` from 4.21.2 to 4.22.0
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.27-next.1
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/plugin-notifications-node@0.2.22-next.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-signals-node@0.1.27-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-notifications-node@0.2.22-next.0
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0

## 0.6.0

### Minor Changes

- 87e597c: Adds support for default configuration for an entire notification channel.
  This setting will also be inherited down to origins and topics while still respecting the users individual choices.

  This will be handy if you want to use a "opt-in" strategy.

### Patch Changes

- 15fb764: Show default settings for notifications even before receiving first notification.

  Previously, it was not possible for the users to see or modify their notification settings until they had received at
  least one notification from specific origin or topic.
  This update ensures that default settings are displayed from the outset,
  allowing users to customize their preferences immediately.

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/plugin-signals-node@0.1.26

## 0.6.0-next.2

### Minor Changes

- 87e597c: Adds support for default configuration for an entire notification channel.
  This setting will also be inherited down to origins and topics while still respecting the users individual choices.

  This will be handy if you want to use a "opt-in" strategy.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.2
  - @backstage/plugin-notifications-node@0.2.21-next.2

## 0.5.12-next.1

### Patch Changes

- 15fb764: Show default settings for notifications even before receiving first notification.

  Previously, it was not possible for the users to see or modify their notification settings until they had received at
  least one notification from specific origin or topic.
  This update ensures that default settings are displayed from the outset,
  allowing users to customize their preferences immediately.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-notifications-node@0.2.21-next.1
  - @backstage/plugin-signals-node@0.1.26-next.1

## 0.5.12-next.0

### Patch Changes

- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.21-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-notifications-common@0.1.2-next.0
  - @backstage/plugin-signals-node@0.1.26-next.0

## 0.5.11

### Patch Changes

- f5e0963: Removed unused dependencies
- 3b8e156: Fixed exclude entity reference not working in notification sending
- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-notifications-common@0.1.1
  - @backstage/plugin-notifications-node@0.2.20
  - @backstage/plugin-signals-node@0.1.25

## 0.5.11-next.2

### Patch Changes

- f5e0963: Removed unused dependencies

## 0.5.11-next.1

### Patch Changes

- 3b8e156: Fixed exclude entity reference not working in notification sending

## 0.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-auth-node@0.6.8-next.0
  - @backstage/plugin-notifications-common@0.1.1-next.0
  - @backstage/plugin-signals-node@0.1.25-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-events-node@0.4.16-next.0
  - @backstage/plugin-notifications-node@0.2.20-next.0

## 0.5.10

### Patch Changes

- a95cebd: Internal refactoring for better type support
- 7e7ed57: A new extension point was added that can be used to modify how the users receiving notifications
  are resolved. The interface passed to the extension point should only return complete user entity references
  based on the notification target references and the excluded entity references. Note that the inputs are lists
  of entity references that can be any entity kind, not just user entities.

  Using this extension point will override the default behavior of resolving users with the
  `DefaultNotificationRecipientResolver`.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/plugin-auth-node@0.6.7
  - @backstage/plugin-events-node@0.4.15
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-node@0.2.19
  - @backstage/backend-plugin-api@1.4.3
  - @backstage/plugin-signals-node@0.1.24

## 0.5.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.1
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/plugin-notifications-node@0.2.19-next.1

## 0.5.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.7-next.0
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-signals-node@0.1.24-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-events-node@0.4.15-next.0
  - @backstage/plugin-notifications-node@0.2.19-next.0

## 0.5.9

### Patch Changes

- 9152ba8: Add an optional generic object `metadata` field to `NotificationPayload`. Metadata can be used to store additional unstructured data for the notification and are available to use by processors.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-auth-node@0.6.6
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2
  - @backstage/plugin-events-node@0.4.14
  - @backstage/plugin-signals-node@0.1.23

## 0.5.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-auth-node@0.6.6-next.0
  - @backstage/plugin-notifications-node@0.2.18-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/plugin-events-node@0.4.14-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-signals-node@0.1.23-next.0

## 0.5.8

### Patch Changes

- 4401dfb: Allow defining default notification settings via configuration
- 9a5a73f: Fix `addTopic` migration when `user_settings` present
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/plugin-auth-node@0.6.5
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-events-node@0.4.13
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-notifications-node@0.2.17
  - @backstage/plugin-signals-node@0.1.22

## 0.5.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-auth-node@0.6.5-next.0
  - @backstage/plugin-notifications-common@0.0.10-next.0
  - @backstage/plugin-signals-node@0.1.22-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-notifications-node@0.2.17-next.0
  - @backstage/plugin-events-node@0.4.13-next.0

## 0.5.8-next.0

### Patch Changes

- 9a5a73f: Fix `addTopic` migration when `user_settings` present
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-notifications-node@0.2.16
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.9
  - @backstage/plugin-signals-node@0.1.21

## 0.5.7

### Patch Changes

- 41d4d6e: Notifications are now automatically deleted after 1 year by default.

  There is a new scheduled task that runs every 24 hours to delete notifications older than 1 year.
  This can be configured by setting the `notifications.retention` in the `app-config.yaml` file.

  ```yaml
  notifications:
    retention: 1y
  ```

  If the retention is set to false, notifications will not be automatically deleted.

- 8a150bf: Internal changes to switch to the non-alpha `catalogServiceRef`
- 1fb5f06: Adds ability for user to turn on/off notifications for specific topics within an origin.
- ef9ab82: Notifications API will now return user as null always for broadcast notifications
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.9
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/plugin-auth-node@0.6.4
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-notifications-node@0.2.16
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12
  - @backstage/plugin-signals-node@0.1.21

## 0.5.7-next.2

### Patch Changes

- 8a150bf: Internal changes to switch to the non-alpha `catalogServiceRef`
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/plugin-notifications-node@0.2.16-next.1
  - @backstage/plugin-signals-node@0.1.21-next.1

## 0.5.7-next.1

### Patch Changes

- 1fb5f06: Adds ability for user to turn on/off notifications for specific topics within an origin.
- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/plugin-auth-node@0.6.4-next.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-notifications-node@0.2.16-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.12-next.1
  - @backstage/plugin-signals-node@0.1.21-next.1

## 0.5.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-auth-node@0.6.4-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-events-node@0.4.12-next.0
  - @backstage/plugin-notifications-node@0.2.16-next.0
  - @backstage/plugin-signals-node@0.1.21-next.0

## 0.5.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/plugin-auth-node@0.6.3
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/plugin-notifications-node@0.2.15
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.20

## 0.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.2
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-events-node@0.4.11-next.2
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.2
  - @backstage/plugin-signals-node@0.1.20-next.2

## 0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## 0.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-auth-node@0.6.3-next.0
  - @backstage/plugin-events-node@0.4.11-next.0
  - @backstage/plugin-notifications-node@0.2.15-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.20-next.0

## 0.5.5

### Patch Changes

- 9a6080e: Allow throttling notification sending not to block the system with huge amount of receiving users
- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/plugin-auth-node@0.6.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.10
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.14
  - @backstage/plugin-signals-node@0.1.19

## 0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13
  - @backstage/plugin-signals-node@0.1.18

## 0.5.5-next.0

### Patch Changes

- 9a6080e: Allow throttling notification sending not to block the system with huge amount of receiving users
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13
  - @backstage/plugin-signals-node@0.1.18

## 0.5.4

### Patch Changes

- 20e8d12: Fix null topics being returned from notification API
- 425a61d: Improved notifications router tests
- d4c22b7: Make sure to post process broadcast notifications even without signals support
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1
  - @backstage/plugin-events-node@0.4.9
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13
  - @backstage/plugin-signals-node@0.1.18

## 0.5.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.9-next.2
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13-next.2
  - @backstage/plugin-signals-node@0.1.18-next.2

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.1
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-events-node@0.4.9-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13-next.1
  - @backstage/plugin-signals-node@0.1.18-next.1

## 0.5.4-next.0

### Patch Changes

- 20e8d12: Fix null topics being returned from notification API
- 425a61d: Improved notifications router tests
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.1-next.0
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-events-node@0.4.9-next.0
  - @backstage/plugin-notifications-node@0.2.13-next.0
  - @backstage/plugin-signals-node@0.1.18-next.0

## 0.5.2

### Patch Changes

- 438c36c: added topic filter for notifications
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/plugin-auth-node@0.6.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-events-node@0.4.8
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12
  - @backstage/plugin-signals-node@0.1.17

## 0.5.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-auth-node@0.6.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.2
  - @backstage/plugin-notifications-node@0.2.12-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-node@0.1.17-next.2

## 0.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/plugin-auth-node@0.6.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-events-node@0.4.8-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.1
  - @backstage/plugin-signals-node@0.1.17-next.1

## 0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.0
  - @backstage/plugin-signals-node@0.1.17-next.0

## 0.5.2-next.0

### Patch Changes

- 438c36c: added topic filter for notifications
- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-auth-node@0.5.7-next.0
  - @backstage/plugin-events-node@0.4.8-next.0
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.0
  - @backstage/plugin-signals-node@0.1.17-next.0

## 0.5.1

### Patch Changes

- cbc0e63: Remove `@backstage/backend-common` dependency
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-events-node@0.4.7
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.11
  - @backstage/plugin-signals-node@0.1.16

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-auth-node@0.5.6-next.1
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/plugin-events-node@0.4.7-next.1
  - @backstage/plugin-signals-node@0.1.16-next.1
  - @backstage/plugin-notifications-node@0.2.11-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-notifications-common@0.0.8-next.0

## 0.5.1-next.0

### Patch Changes

- cbc0e63: Remove `@backstage/backend-common` dependency
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.6-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-events-node@0.4.7-next.0
  - @backstage/plugin-notifications-common@0.0.7
  - @backstage/plugin-notifications-node@0.2.11-next.0
  - @backstage/plugin-signals-node@0.1.16-next.0

## 0.5.0

### Minor Changes

- fc15b77: **BREAKING**: Removed redundant `/health` endpoint, switch to using [the built-in endpoint instead](https://backstage.io/docs/backend-system/core-services/root-health).

### Patch Changes

- fc15b77: Deprecated root '/' endpoints, moving them under `/notifications` instead.
- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/plugin-events-node@0.4.6
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-notifications-node@0.2.10
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/plugin-notifications-common@0.0.7
  - @backstage/plugin-signals-node@0.1.15

## 0.5.0-next.2

### Minor Changes

- fc15b77: **BREAKING**: Removed redundant `/health` endpoint, switch to using [the built-in endpoint instead](https://backstage.io/docs/backend-system/core-services/root-health).

### Patch Changes

- fc15b77: Deprecated root '/' endpoints, moving them under `/notifications` instead.
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-events-node@0.4.6-next.2
  - @backstage/plugin-notifications-node@0.2.10-next.2
  - @backstage/plugin-signals-node@0.1.15-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/plugin-notifications-common@0.0.7-next.0

## 0.4.4-next.1

### Patch Changes

- 5c9cc05: Use native fetch instead of node-fetch
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/plugin-notifications-node@0.2.10-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-signals-node@0.1.15-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-events-node@0.4.6-next.1
  - @backstage/plugin-notifications-common@0.0.6

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-events-node@0.4.6-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-notifications-node@0.2.10-next.0
  - @backstage/plugin-signals-node@0.1.15-next.0

## 0.4.3

### Patch Changes

- 97ba58f: Add support for user specific notification settings
- 4e58bc7: Upgrade to uuid v11 internally
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/plugin-events-node@0.4.5
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-notifications-node@0.2.9
  - @backstage/plugin-signals-node@0.1.14
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5

## 0.4.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.5-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-notifications-node@0.2.9-next.3
  - @backstage/plugin-signals-node@0.1.14-next.3

## 0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/plugin-events-node@0.4.5-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-notifications-node@0.2.9-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-signals-node@0.1.14-next.2

## 0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-events-node@0.4.4-next.1
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-notifications-node@0.2.9-next.1
  - @backstage/plugin-signals-node@0.1.14-next.1

## 0.4.3-next.0

### Patch Changes

- 97ba58f: Add support for user specific notification settings
- Updated dependencies
  - @backstage/plugin-events-node@0.4.3-next.0
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-node@0.2.9-next.0
  - @backstage/plugin-signals-node@0.1.14-next.0

## 0.4.1

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-notifications-node@0.2.7
  - @backstage/plugin-signals-node@0.1.12
  - @backstage/plugin-events-node@0.4.1
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.5

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.7-next.1
  - @backstage/plugin-signals-node@0.1.12-next.1

## 0.4.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.7-next.0
  - @backstage/plugin-signals-node@0.1.12-next.0
  - @backstage/plugin-events-node@0.4.1-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.4.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 1c6f142: Internal refactor to avoid use of insecure coding patterns.
- 4a53dd0: Implement icon in backend and show icon in table if available.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- f195972: Validate notification link when new notification is created
- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/plugin-signals-node@0.1.11
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/plugin-events-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6

## 0.4.0-next.2

### Patch Changes

- 4a53dd0: Implement icon in backend and show icon in table if available.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-events-node@0.4.0-next.2
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6-next.2
  - @backstage/plugin-signals-node@0.1.11-next.2

## 0.4.0-next.1

### Patch Changes

- f195972: Validate notification link when new notification is created
- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-events-node@0.4.0-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6-next.1
  - @backstage/plugin-signals-node@0.1.11-next.1

## 0.4.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-events-node@0.4.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/plugin-notifications-node@0.2.6-next.0
  - @backstage/plugin-signals-node@0.1.11-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.5

## 0.3.4

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- d55b8e3: Avoid sending broadcast emails as a fallback in case the entity-typed notification user can not be resolved.
- 8013044: fix: consider broadcast union with user
- 7a05f50: Allow using notifications without users in the catalog
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-notifications-node@0.2.4
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.9
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.9

## 0.3.4-next.3

### Patch Changes

- 7a05f50: Allow using notifications without users in the catalog
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-events-node@0.3.9-next.3
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.3
  - @backstage/plugin-signals-node@0.1.9-next.3

## 0.3.4-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-notifications-node@0.2.4-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-events-node@0.3.9-next.2
  - @backstage/plugin-signals-node@0.1.9-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.5

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-events-node@0.3.9-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.1
  - @backstage/plugin-signals-node@0.1.9-next.1

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-events-node@0.3.9-next.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.0
  - @backstage/plugin-signals-node@0.1.9-next.0

## 0.3.3

### Patch Changes

- d7b8ca5: Added an option to filter notifications by topic
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-events-node@0.3.8
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.3
  - @backstage/plugin-signals-node@0.1.8
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-events-node@0.3.8-next.1
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/plugin-notifications-node@0.2.3-next.1
  - @backstage/plugin-signals-node@0.1.8-next.1

## 0.3.2-next.0

### Patch Changes

- d7b8ca5: Added an option to filter notifications by topic
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-events-node@0.3.7-next.0
  - @backstage/plugin-notifications-node@0.2.2-next.0
  - @backstage/plugin-signals-node@0.1.7-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.4

## 0.3.0

### Minor Changes

- 07a789b: adding filtering of notifications by processors

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-notifications-node@0.2.0
  - @backstage/plugin-events-node@0.3.5
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/plugin-signals-node@0.1.5
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-notifications-common@0.0.4-next.0
  - @backstage/plugin-notifications-node@0.2.0-next.3
  - @backstage/plugin-signals-node@0.1.5-next.3
  - @backstage/plugin-events-node@0.3.5-next.2
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/plugin-events-node@0.3.5-next.1
  - @backstage/plugin-notifications-node@0.2.0-next.2
  - @backstage/plugin-signals-node@0.1.5-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.3

## 0.3.0-next.1

### Minor Changes

- 07a789b: adding filtering of notifications by processors

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-notifications-node@0.2.0-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/plugin-signals-node@0.1.5-next.1

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/plugin-events-node@0.3.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/plugin-notifications-node@0.1.5-next.0
  - @backstage/plugin-signals-node@0.1.5-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.3

## 0.2.1

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- cba628a: Add possibility to generate random notifications on the fly in local development
- ee09dfc: Updated documentation for sending messages by external services.
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-notifications-node@0.1.4
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-events-node@0.3.4
  - @backstage/plugin-auth-node@0.4.13
  - @backstage/catalog-client@1.6.5
  - @backstage/plugin-signals-node@0.1.4

## 0.2.1-next.2

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-events-node@0.3.4-next.2

## 0.2.1-next.1

### Patch Changes

- 295c05d: Support for filtering entities from notification recipients after resolving them from the recipients
- cba628a: Add possibility to generate random notifications on the fly in local development
- Updated dependencies
  - @backstage/plugin-notifications-node@0.1.4-next.1
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/plugin-events-node@0.3.4-next.1
  - @backstage/plugin-signals-node@0.1.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.2.1-next.0

### Patch Changes

- ee09dfc: Updated documentation for sending messages by external services.
- Updated dependencies
  - @backstage/catalog-model@1.5.0-next.0
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/catalog-client@1.6.5-next.0
  - @backstage/plugin-notifications-node@0.1.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.3.4-next.0
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/plugin-signals-node@0.1.4-next.0

## 0.2.0

### Minor Changes

- 939b4ec: Notifications-backend URL query parameter changed from `minimal_severity` to `minimumSeverity`.
- ec40998: On the Notifications page, the user can trigger "Save" or "Mark as read" actions once for multiple selected notifications.

### Patch Changes

- 0d99528: Notification processor functions are now renamed to `preProcess` and `postProcess`.
  Additionally, processor name is now required to be returned by `getName`.
  A new processor functionality `processOptions` was added to process options before sending the notification.
- e003e0e: The ordered list of notifications' severities is exported by notifications-common for reusability.
- 9a41a7b: Migrate signals and notifications to the new backend in local development
- 9987066: fix: retrieve relations and children when mapping group entities for notifications
- 6206039: Fix entity owner resolution in notifications
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/plugin-notifications-common@0.0.3
  - @backstage/plugin-notifications-node@0.1.3
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/catalog-client@1.6.4
  - @backstage/plugin-events-node@0.3.3
  - @backstage/plugin-signals-node@0.1.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.0-next.1

### Minor Changes

- ec40998: On the Notifications page, the user can trigger "Save" or "Mark as read" actions once for multiple selected notifications.

### Patch Changes

- 9987066: fix: retrieve relations and children when mapping group entities for notifications
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/catalog-client@1.6.4-next.0
  - @backstage/plugin-events-node@0.3.3-next.1
  - @backstage/plugin-notifications-node@0.1.3-next.1
  - @backstage/plugin-signals-node@0.1.3-next.1
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/catalog-client@1.6.3
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-node@0.4.12-next.0
  - @backstage/plugin-events-node@0.3.3-next.0
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/plugin-notifications-node@0.1.3-next.0
  - @backstage/plugin-signals-node@0.1.3-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.3
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/plugin-notifications-node@0.1.2
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-signals-node@0.1.2
  - @backstage/plugin-events-node@0.3.2
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.6.2
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/plugin-notifications-node@0.1.1
  - @backstage/plugin-events-node@0.3.1
  - @backstage/plugin-signals-node@0.1.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/catalog-model@1.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-notifications-common@0.0.2

## 0.1.0

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options
- cd96173: Notifications-backend URL query parameters changed from `sort/sortOrder` to `orderField` and `created_after` to `createdAfter` to unify with other plugins.
- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory
- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- ba14c0e: Support for broadcast notifications
- dff7a7e: All notifications can be marked and filtered by severity critical, high, normal or low, the default is 'normal'
- 4467036: Allow unauthenticated access to health check endpoint.
- 6c1547a: **BREAKING** Type definition added to signal recipients

  Update to use `{type: 'broadcast'}` instead `null` and `{type: 'user', entityRef: ''}`
  instead string entity references

- 75f2d84: the user can newly mark notifications as "Saved" for their better visibility in the future
- a790a3d: Move notification origin resolving to backend with new auth
- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 84af361: Migrated to using the new auth services.
- 6d84ee6: Changed to use the refactored signal service naming
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2
  - @backstage/plugin-notifications-node@0.1.0
  - @backstage/plugin-events-node@0.3.0
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-signals-node@0.1.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/catalog-client@1.6.1
  - @backstage/catalog-model@1.4.5

## 0.1.0-next.2

### Minor Changes

- 6e6d096: notifications can be newly sorted by list of predefined options

### Patch Changes

- 6d84ee6: Changed to use the refactored signal service naming
- Updated dependencies
  - @backstage/plugin-signals-node@0.1.0-next.2
  - @backstage/catalog-client@1.6.1-next.1
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-notifications-node@0.1.0-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.2
  - @backstage/plugin-notifications-common@0.0.2-next.1

## 0.1.0-next.1

### Minor Changes

- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-notifications-node@0.1.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.1

## 0.1.0-next.0

### Minor Changes

- 758f2a4: The Notifications frontend has been redesigned towards list view with condensed row details. The 'done' attribute has been removed to keep the Notifications aligned with the idea of a messaging system instead of a task manager.

### Patch Changes

- 5d9c5ba: The Notifications can be newly filtered based on the Created Date.
- 0fb419b: Updated dependency `uuid` to `^9.0.0`.
  Updated dependency `@types/uuid` to `^9.0.0`.
- 84af361: Migrated to using the new auth services.
- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-notifications-node@0.1.0-next.0
  - @backstage/plugin-signals-node@0.0.4-next.0
  - @backstage/plugin-notifications-common@0.0.2-next.0
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/config@1.1.2-next.0

## 0.0.1

### Patch Changes

- 9873c44: Add support for signal type in notifications
- 8472188: Added or fixed the `repository` field in `package.json`.
- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/plugin-signals-node@0.0.1
  - @backstage/plugin-notifications-common@0.0.1
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/catalog-model@1.4.4
  - @backstage/catalog-client@1.6.0
  - @backstage/plugin-notifications-node@0.0.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19

## 0.0.1-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-notifications-common@0.0.1-next.1
  - @backstage/plugin-notifications-node@0.0.1-next.1
  - @backstage/plugin-signals-node@0.0.1-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-events-node@0.2.19-next.3

## 0.0.1-next.0

### Patch Changes

- fb8fc24: Initial notifications system for backstage
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/plugin-signals-node@0.0.1-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/plugin-notifications-common@0.0.1-next.0
  - @backstage/plugin-notifications-node@0.0.1-next.0
  - @backstage/plugin-events-node@0.2.19-next.2
  - @backstage/config@1.1.1
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/errors@1.2.3
