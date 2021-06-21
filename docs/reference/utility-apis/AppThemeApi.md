---
---
# AppThemeApi

The AppThemeApi type is defined at
[packages/core-api/src/apis/definitions/AppThemeApi.ts:56](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AppThemeApi.ts#L56).

The following Utility API implements this type:
[appThemeApiRef](./README.md#apptheme)

## Members

### getInstalledThemes()

Get a list of available themes.

<pre>
getInstalledThemes(): <a href="#apptheme">AppTheme</a>[]
</pre>

### activeThemeId\$()

Observe the currently selected theme. A value of undefined means no specific
theme has been selected.

<pre>
activeThemeId$(): <a href="#observable">Observable</a>&lt;string | undefined&gt;
</pre>

### getActiveThemeId()

Get the current theme ID. Returns undefined if no specific theme is selected.

<pre>
getActiveThemeId(): string | undefined
</pre>

### setActiveThemeId()

Set a specific theme to use in the app, overriding the default theme selection.

Clear the selection by passing in undefined.

<pre>
setActiveThemeId(themeId?: string): void
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AppTheme

Describes a theme provided by the app.

```tsx
export type AppTheme = {
  /**
   * ID used to remember theme selections.
   */
  id: string;

  /**
   * Title of the theme
   */
  title: string;

  /**
   * Theme variant
   */
  variant: 'light' | 'dark';

  /**
   * The specialized MaterialUI theme instance.
   */
  theme: <a href="#backstagetheme">BackstageTheme</a>;

  /**
   * An Icon for the theme mode setting.
   */
  icon?: React.ReactElement&lt;SvgIconProps&gt;;
}
```

Defined at
[packages/core-api/src/apis/definitions/AppThemeApi.ts:25](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/apis/definitions/AppThemeApi.ts#L25).

Referenced by: [getInstalledThemes](#getinstalledthemes).

### BackstagePalette

<pre>
export type BackstagePalette = Palette &amp; <a href="#paletteadditions">PaletteAdditions</a>
</pre>

Defined at
[packages/theme/src/types.ts:74](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/theme/src/types.ts#L74).

Referenced by: [BackstageTheme](#backstagetheme).

### BackstageTheme

```tsx
export interface BackstageTheme extends Theme {
  palette: <a href="#backstagepalette">BackstagePalette</a>;
  page: <a href="#pagetheme">PageTheme</a>;
  getPageTheme: ({ themeId }: <a href="#pagethemeselector">PageThemeSelector</a>) =&gt; <a href="#pagetheme">PageTheme</a>;
}
```

Defined at
[packages/theme/src/types.ts:81](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/theme/src/types.ts#L81).

Referenced by: [AppTheme](#apptheme).

### Observable

Observable sequence of values and errors, see TC39.

https://github.com/tc39/proposal-observable

This is used as a common return type for observable values and can be created
using many different observable implementations, such as zen-observable or
RxJS 5.

```tsx
export type Observable&lt;T&gt; = {
  /**
   * Subscribes to this observable to start receiving new values.
   */
  subscribe(observer: <a href="#observer">Observer</a>&lt;T&gt;): <a href="#subscription">Subscription</a>;
  subscribe(
    onNext: (value: T) =&gt; void,
    onError?: (error: Error) =&gt; void,
    onComplete?: () =&gt; void,
  ): <a href="#subscription">Subscription</a>;
}
```

Defined at
[packages/core-api/src/types.ts:53](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L53).

Referenced by: [activeThemeId\$](#activethemeid).

### Observer

This file contains non-react related core types used throughout Backstage.

Observer interface for consuming an Observer, see TC39.

```ts
export type Observer&lt;T&gt; = {
  next?(value: T): void;
  error?(error: Error): void;
  complete?(): void;
}
```

Defined at
[packages/core-api/src/types.ts:24](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L24).

Referenced by: [Observable](#observable).

### PageTheme

```ts
export type PageTheme = {
  colors: string[];
  shape: string;
  backgroundImage: string;
}
```

Defined at
[packages/theme/src/types.ts:103](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/theme/src/types.ts#L103).

Referenced by: [BackstageTheme](#backstagetheme).

### PageThemeSelector

```ts
export type PageThemeSelector = {
  themeId: string;
}
```

Defined at
[packages/theme/src/types.ts:77](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/theme/src/types.ts#L77).

Referenced by: [BackstageTheme](#backstagetheme).

### PaletteAdditions

```ts
type PaletteAdditions = {
  status: {
    ok: string;
    warning: string;
    error: string;
    pending: string;
    running: string;
    aborted: string;
  };
  border: string;
  textContrast: string;
  textVerySubtle: string;
  textSubtle: string;
  highlight: string;
  errorBackground: string;
  warningBackground: string;
  infoBackground: string;
  errorText: string;
  infoText: string;
  warningText: string;
  linkHover: string;
  link: string;
  gold: string;
  navigation: {
    background: string;
    indicator: string;
    color: string;
    selectedColor: string;
  };
  tabbar: {
    indicator: string;
  };
  bursts: {
    fontColor: string;
    slackChannelText: string;
    backgroundColor: {
      default: string;
    };
  };
  pinSidebarButton: {
    icon: string;
    background: string;
  };
  banner: {
    info: string;
    error: string;
    text: string;
    link: string;
  };
}
```

Defined at
[packages/theme/src/types.ts:23](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/theme/src/types.ts#L23).

Referenced by: [BackstagePalette](#backstagepalette).

### Subscription

Subscription returned when subscribing to an Observable, see TC39.

```ts
export type Subscription = {
  /**
   * Cancels the subscription
   */
  unsubscribe(): void;

  /**
   * Value indicating whether the subscription is closed.
   */
  readonly closed: Boolean;
}
```

Defined at
[packages/core-api/src/types.ts:33](https://github.com/backstage/backstage/blob/a4dbd8353cfa4d4d4334473e2c33afcda64e130d/packages/core-api/src/types.ts#L33).

Referenced by: [Observable](#observable).
