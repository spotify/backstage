# @backstage/plugin-tech-radar

<img src="docs/screenshot.png" alt="Screenshot of Tech Radar plugin" />

The Backstage integration for the Tech Radar based on [Zalando's Tech Radar](https://opensource.zalando.com/tech-radar/) open sourced on [GitHub](https://github.com/zalando/tech-radar). This is used at [Spotify](https://spotify.github.io) for visualizing the official guidelines of different areas of software development such as languages, frameworks, infrastructure and processes.

Read the [blog post on backstage.io about the Tech Radar](https://backstage.io/blog/2020/05/14/tech-radar-plugin).

## Purpose

Zalando has a fantastic description [on their website](https://opensource.zalando.com/tech-radar/):

> The Tech Radar is a tool to inspire and support engineering teams at Zalando to pick the best technologies for new projects; it provides a platform to share knowledge and experience in technologies, to reflect on technology decisions and continuously evolve our technology landscape. Based on the pioneering work of ThoughtWorks, our Tech Radar sets out the changes in technologies that are interesting in software development — changes that we think our engineering teams should pay attention to and consider using in their projects.

It serves and scales well for teams and companies of all sizes that want to have alignment across dozens of technologies and visualize it in a simple way.

## Getting Started

The Tech Radar can be used in two ways:

- **Simple (Recommended)** - This gives you an out-of-the-box Tech Radar experience. It lives on the `/tech-radar` URL of your Backstage installation.
- **Advanced** - This gives you the React UI component directly. It enables you to insert the Radar on your own layout or page for a more customized feel.

### Install

For either simple or advanced installations, you'll need to add the dependency using Yarn:

```sh
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-tech-radar
```

### Configuration

Modify your app routes to include the Router component exported from the tech radar, for example:

```tsx
// In packages/app/src/App.tsx
import { TechRadarPage } from '@backstage/plugin-tech-radar';

const routes = (
  <FlatRoutes>
    {/* ...other routes */}
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
```

If you'd like to configure it more, see the `TechRadarPageProps` and `TechRadarComponentProps` types for options:

```ts
export type TechRadarPageProps = TechRadarComponentProps & {
  title?: string;
  subtitle?: string;
  pageTitle?: string;
};

export interface TechRadarPageProps {
  width: number;
  height: number;
  svgProps?: object;
}
```

## Frequently Asked Questions

### Who created the Tech Radar?

[ThoughtWorks](https://thoughtworks.com/radar) created the Tech Radar concept, and [Zalando created the visualization](https://opensource.zalando.com/tech-radar/) that we use at Spotify and in this plugin.

### How do I load in my own data?

The `TechRadar` plugin uses the `techRadarApiRef` to get a client which implements the `TechRadarApi` interface. The default sample one is located [here](https://github.com/backstage/backstage/blob/master/plugins/tech-radar/src/sample.ts). To load your own data, you'll need to provide a class that implements the `TechRadarApi` and override the `techRadarApiRef` in the `app/src/apis.ts`.

```ts
// app/src/lib/MyClient.ts
import {
  TechRadarApi,
  TechRadarLoaderResponse,
} from '@backstage/plugin-tech-radar';

class MyOwnClient implements TechRadarApi {
  async load(id: string | undefined): Promise<TechRadarLoaderResponse> {
    // if needed id prop can be used to fetch the correct data

    const data = await fetch('https://mydata.json').then(res => res.json());

    // maybe you'll need to do some data transformation here to make it look like TechRadarLoaderResponse

    return data;
  }
}

// app/src/apis.ts
import { MyOwnClient } from './lib/MyClient';
import { techRadarApiRef } from '@backstage/plugin-tech-radar';

export const apis: AnyApiFactory[] = [
  /*
  ...
  */
  createApiFactory(techRadarApiRef, new MyOwnClient()),
];
```

### How do I write tests?

You can use the `svgProps` option to pass custom React props to the `<svg>` element we create for the Tech Radar. This complements well with the `data-testid` attribute and the `@testing-library/react` library we use in Backstage.

```tsx
<TechRadarComponent
  width={1400}
  height={800}
  svgProps={{
    'data-testid': 'tech-radar-svg',
  }}
/>

// Then, in your tests...
// const { getByTestId } = render(...);
// expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
```

### How do I support multiple radars

The `TechRadarPage` and `TechRadarComponent` components both take an optional `id` prop which is subsequently passed to the `load` method of the API to distinguish which radar's data to load.
