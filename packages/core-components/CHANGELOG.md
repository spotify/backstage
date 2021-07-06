# @backstage/core-components

## 0.1.4

### Patch Changes

- f423891ee: Fixed sizing of the System diagram when the rendered graph was wider than the container.
- 3db266fe4: Make `ErrorBoundary` display more helpful information about the error that
  occurred.

  The `slackChannel` (optional) prop can now be passed as an object on the form
  `{ name: string; href?: string; }` in addition to the old string form. If you
  are using the error boundary like

  ```tsx
  <ErrorBoundary slackChannel="#support">
    <InnerComponent>
  </ErrorBoundary>
  ```

  you may like to migrate it to

  ```tsx
  const support = {
    name: '#support',
    href: 'https://slack.com/channels/your-channel',
  };

  <ErrorBoundary slackChannel={support}>
    <InnerComponent>
  </ErrorBoundary>
  ```

  Also deprecated the prop `slackChannel` on `TabbedCard` and `InfoCard`, while
  adding the prop `errorBoundaryProps` to replace it.

- e8c65b068: Clear the previously selected sign-in provider on failure

## 0.1.3

### Patch Changes

- d2c31b132: Add title prop in SupportButton component
- d4644f592: Use the Backstage `Link` component in the `Button`

## 0.1.2

### Patch Changes

- e47336ea4: Use app.title for helmet in header
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

- Updated dependencies [75b8537ce]
- Updated dependencies [da8cba44f]
  - @backstage/core-plugin-api@0.1.2

## 0.1.1

### Patch Changes

- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/theme@0.2.8
