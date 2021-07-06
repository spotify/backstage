# @backstage/plugin-rollbar-backend

## 0.1.12

### Patch Changes

- 3108ff7bf: Make `yarn dev` respect the `PLUGIN_PORT` environment variable.
- Updated dependencies
  - @backstage/backend-common@0.8.3

## 0.1.11

### Patch Changes

- Updated dependencies [22fd8ce2a]
- Updated dependencies [f9fb4a205]
  - @backstage/backend-common@0.8.0

## 0.1.10

### Patch Changes

- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
  - @backstage/backend-common@0.7.0
  - @backstage/config@0.1.5

## 0.1.9

### Patch Changes

- 49574a8a3: Fix some `spleling`.

  The `scaffolder-backend` has a configuration schema change that may be breaking
  in rare circumstances. Due to a typo in the schema, the
  `scaffolder.github.visibility`, `scaffolder.gitlab.visibility`, and
  `scaffolder.bitbucket.visibility` did not get proper validation that the value
  is one of the supported strings (`public`, `internal` (not available for
  Bitbucket), and `private`). If you had a value that was not one of these three,
  you may have to adjust your config.

- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.1.8

### Patch Changes

- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.1.7

### Patch Changes

- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [09a370426]
  - @backstage/backend-common@0.5.0

## 0.1.6

### Patch Changes

- dde4ab398: Bump `axios` from `^0.20.0` to `^0.21.1`.
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2

## 0.1.5

### Patch Changes

- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2

## 0.1.4

### Patch Changes

- 3a201c5d5: Add config schema for the rollbar & rollbar-backend plugins
- Updated dependencies [3aa7efb3f]
- Updated dependencies [b3d4e4e57]
  - @backstage/backend-common@0.3.2

## 0.1.3

### Patch Changes

- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.1.2

### Patch Changes

- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [8afce088a]
- Updated dependencies [7bbeb049f]
  - @backstage/backend-common@0.2.0
