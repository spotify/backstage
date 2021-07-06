# @backstage/core-app-api

## 0.1.4

### Patch Changes

- 62abffee4: Reintroduce export of `defaultConfigLoader`.
- Updated dependencies
  - @backstage/core-components@0.1.4

## 0.1.3

### Patch Changes

- dc3e7ce68: Introducing new UnhandledErrorForwarder installed by default. For catching unhandled promise rejections, you can override the API to align with general error handling.
- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.2

### Patch Changes

- 9bca2a252: Fixes a type bug where supplying all app icons to `createApp` was required, rather than just a partial list.
- 75b8537ce: This change adds automatic error boundaries around extensions.

  This means that all exposed parts of a plugin are wrapped in a general error boundary component, that is plugin aware. The default design for the error box is borrowed from `@backstage/errors`. To override the default "fallback", one must provide a component named `ErrorBoundaryFallback` to `createApp`, like so:

  ```ts
  const app = createApp({
    components: {
      ErrorBoundaryFallback: props => {
        // a custom fallback component
        return (
          <>
            <h1>Oops.</h1>
            <h2>
              The plugin {props.plugin.getId()} failed with{' '}
              {props.error.message}
            </h2>
            <button onClick={props.resetError}>Try again</button>
          </>
        );
      },
    },
  });
  ```

  The props here include:

  - `error`. An `Error` object or something that inherits it that represents the error that was thrown from any inner component.
  - `resetError`. A callback that will simply attempt to mount the children of the error boundary again.
  - `plugin`. A `BackstagePlugin` that can be used to look up info to be presented in the error message. For instance, you may want to keep a map of your internal plugins and team names or slack channels and present these when an error occurs. Typically, you'll do that by getting the plugin ID with `plugin.getId()`.

- da8cba44f: Deprecate and disable the extension creation methods, which were added to this package by mistake and should only exist within `@backstage/core-plugin-api`.
- 9bca2a252: Update `createApp` options to allow plugins with unknown output types in order to improve forwards and backwards compatibility.
- Updated dependencies [e47336ea4]
- Updated dependencies [75b8537ce]
- Updated dependencies [da8cba44f]
  - @backstage/core-components@0.1.2
  - @backstage/core-plugin-api@0.1.2

## 0.1.1

### Patch Changes

- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/core-components@0.1.1
  - @backstage/theme@0.2.8
