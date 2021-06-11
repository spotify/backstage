---
id: getting-started
title: Getting Started
description: Getting Started Documentation
---

TechDocs functions as a plugin to Backstage, so you will need to use Backstage
to use TechDocs.

If you haven't setup Backstage already, start
[here](../../getting-started/index.md).

> If you used `npx @backstage/create-app`, TechDocs may already be present.
>
> You should skip to [`Setting the Configuration`](#setting-the-configuration)
> below.

## Adding TechDocs frontend plugin

The first step is to add the TechDocs plugin to your Backstage application.
Navigate to your new Backstage application directory. And then to your
`packages/app` directory, and install the `@backstage/plugin-techdocs` package.

```bash
# From your Backstage root directory
cd packages/app
yarn add @backstage/plugin-techdocs
```

Once the package has been installed, you need to import the plugin in your app.

In `packages/app/src/App.tsx`, import `TechDocsPage` and add the following to
`FlatRoutes`:

```tsx
import { TechDocsPage } from '@backstage/plugin-techdocs';

// ...

const AppRoutes = () => {
  <FlatRoutes>
    // ... other plugin routes
    <Route path="/docs" element={<TechdocsPage />} />
  </FlatRoutes>;
};
```

That's it! But now, we need the TechDocs Backend plugin for the frontend to
work.

## Adding TechDocs Backend plugin

Navigate to `packages/backend` of your Backstage app, and install the
`@backstage/plugin-techdocs-backend` package.

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-techdocs-backend
```

Create a file called `techdocs.ts` inside `packages/backend/src/plugins/` and
add the following

```typescript
import { DockerContainerRunner } from '@backstage/backend-common';
import {
  createRouter,
  Generators,
  Preparers,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import Docker from 'dockerode';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
  reader,
}: PluginEnvironment) {
  // Preparers are responsible for fetching source files for documentation.
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  // Docker client (conditionally) used by the generators, based on techdocs.generators config.
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });

  // Generators are used for generating documentation sites.
  const generators = await Generators.fromConfig(config, {
    logger,
    containerRunner,
  });

  // Publisher is used for
  // 1. Publishing generated files to storage
  // 2. Fetching files from storage and passing them to TechDocs frontend.
  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });

  // checks if the publisher is working and logs the result
  await publisher.getReadiness();

  return await createRouter({
    preparers,
    generators,
    publisher,
    logger,
    config,
    discovery,
  });
}
```

You may need to install the `dockerode` package. But you may already have it in
your backend since [Scaffolder plugin](../software-templates/index.md) also uses
it.

See [Concepts](concepts.md) and [TechDocs Architecture](architecture.md) to
learn more about how preparers, generators and publishers work.

The final step is to import the techdocs backend plugin in Backstage app
backend. Add the following to your `packages/backend/src/index.ts`:

```typescript
import techdocs from './plugins/techdocs';

// .... main should already be present.
async function main() {
  // ... other backend plugin envs
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));

  // ... other backend plugin routes
  apiRouter.use('/techdocs', await techdocs(techdocsEnv));
}
```

That's it! TechDocs frontend and backend have now been added to your Backstage
app. Now let us tweak some configurations to suit your needs.

## Setting the configuration

**See [TechDocs Configuration Options](configuration.md) for complete
configuration reference.**

### Should TechDocs Backend generate docs?

```yaml
techdocs:
  builder: 'local'
```

Note that we recommend generating docs on CI/CD instead. Read more in the
"Basic" and "Recommended" sections of the
[TechDocs Architecture](architecture.md). But if you want to get started quickly
set `techdocs.builder` to `'local'` so that TechDocs Backend is responsible for
generating documentation sites. If set to `'external'`, Backstage will assume
that the sites are being generated on each entity's CI/CD pipeline, and are
being stored in a storage somewhere.

When `techdocs.builder` is set to `'external'`, TechDocs becomes more or less a
read-only experience where it serves static files from a storage containing all
the generated documentation.

### Choosing storage (publisher)

TechDocs needs to know where to store generated documentation sites and where to
fetch the sites from. This is managed by a
[Publisher](./concepts.md#techdocs-publisher). Examples: Google Cloud Storage,
Amazon S3, or local filesystem of Backstage server.

It is okay to use the local filesystem in a "basic" setup when you are trying
out Backstage for the first time. At a later time, review
[Using Cloud Storage](./using-cloud-storage.md).

```yaml
techdocs:
  builder: 'local'
  publisher:
    type: 'local'
```

### Disabling Docker in Docker situation (Optional)

You can skip this if your `techdocs.builder` is set to `'external'`.

The TechDocs Backend plugin runs a docker container with mkdocs installed to
generate the frontend of the docs from source files (Markdown). If you are
deploying Backstage using Docker, this will mean that your Backstage Docker
container will try to run another Docker container for TechDocs Backend.

To avoid this problem, we have a configuration available. You can set a value in
your `app-config.yaml` that tells the techdocs generator if it should run the
`local` mkdocs or run it from `docker`. This defaults to running as `docker` if
no config is provided.

```yaml
techdocs:
  builder: 'local'
  publisher:
    type: 'local'
  generators:
    techdocs: local
```

Setting `generators.techdocs` to `local` means you will have to make sure your
environment is compatible with techdocs.

You will have to install the `mkdocs` and `mkdocs-techdocs-core` package from
pip, as well as `graphviz` and `plantuml` from your OS package manager (e.g.
apt). See our
[`Dockerfile`](https://github.com/backstage/techdocs-container/blob/main/Dockerfile)
for the latest requirements. You should be trying to match your `Dockerfile`
with this one.

Note: We recommend Python version 3.7 or higher.

> Caveat: Please install the `mkdocs-techdocs-core` package after all other
> Python packages. The order is important to make sure we get correct version of
> some of the dependencies. For example, we want `Markdown` version to be
> [3.2.2](https://github.com/backstage/backstage/blob/f9f70c225548017b6a14daea75b00fbd399c11eb/packages/techdocs-container/techdocs-core/requirements.txt#L11).
> You can also explicitly install `Markdown==3.2.2` after installing all other
> Python packages.

## Running Backstage locally

Start the frontend and the backend app by
[running Backstage locally](../../getting-started/running-backstage-locally.md).

Open your browser at [http://localhost:3000/docs/](http://localhost:3000/docs/)
to see all your documentation sites.

## Additional reading

- [Creating and publishing your docs](creating-and-publishing.md)
- [Back to README](README.md)
