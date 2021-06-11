# shortcuts

The shortcuts plugin allows a user to have easy access to pages within a Backstage app by storing them as "shortcuts" in the Sidebar.

## Usage

Install the package:

```bash
yarn add @backstage/plugin-shortcuts
```

Add it to your App's `plugins.ts` file:

```ts
// ...
export { shortcutsPlugin } from '@backstage/plugin-shortcuts';
```

Add the `<Shortcuts />` component within your `<Sidebar>`:

```tsx
import { Sidebar, SidebarDivider, SidebarSpace } from '@backstage/core';
import { Shortcuts } from '@backstage/plugin-shortcuts';

export const SidebarComponent = () => (
  <Sidebar>
    {/* ... */}
    <SidebarDivider />
    <Shortcuts />
    <SidebarSpace />
  </Sidebar>
);
```

The plugin exports a `shortcutApiRef` but the plugin includes a default implementation of the `ShortcutApi` that uses `localStorage` to store each user's shortcuts.

To overwrite the default implementation add it to the App's `apis.ts`:

```ts
import { shortcutsApiRef } from '@backstage/plugin-shortcuts';
import { CustomShortcutsImpl } from '...';

export const apis = [
  // ...
  createApiFactory({
    api: shortcutsApiRef,
    deps: {},
    factory: () => new CustomShortcutsImpl(),
  }),
];
```
