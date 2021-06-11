# @backstage/plugin-splunk-on-call

## 0.3.1

### Patch Changes

- dc3558e84: Update Splunk On Call plugin to render warning message about incorrectly configured team annotation
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.3.0

### Minor Changes

- 8aa0b6025: Updates the Splunk On-Call plugin for the [composability system
  migration](https://backstage.io/docs/plugins/composability#porting-existing-plugins).

  To upgrade, modify your `EntityPage` to use the updated export names. The
  `EntitySplunkOnCallCard` should be wrapped in an `<EntitySwitch>` condition as
  shown in the plugin README, which you may already have in place.

  ```diff
  import {
  - isPluginApplicableToEntity as isSplunkOnCallAvailable,
  +  isSplunkOnCallAvailable,
  - SplunkOnCallCard
  +  EntitySplunkOnCallCard,
  } from '@backstage/plugin-splunk-on-call';

  ...
  -  <SplunkOnCallCard entity={entity}>
  +  <EntitySplunkOnCallCard />
  ```

### Patch Changes

- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10

## 0.2.1

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.2.0

### Minor Changes

- a310f33d8: Updated splunk-on-call plugin to use the REST endpoint (incident creation-acknowledgement-resolution).
  It implies switching from `splunkOnCall.username` configuration to `splunkOnCall.eventsRestEndpoint` configuration, this is a breaking change.

### Patch Changes

- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
  - @backstage/catalog-model@0.7.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.1.4

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.1.3

### Patch Changes

- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.1.2

### Patch Changes

- 70e2ba9cf: Added splunk-on-call plugin.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4
