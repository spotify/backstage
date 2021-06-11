---
id: how-to-guides
title: TechDocs "HOW TO" guides
sidebar_label: "HOW TO" guides
description: TechDocs "HOW TO" guides related to TechDocs
---

## How to migrate from TechDocs Basic to Recommended deployment approach?

The main difference between TechDocs Basic and Recommended deployment approach
is where the docs are generated and stored. In Basic or the out-of-the-box
setup, docs are generated and stored at the server running your Backstage
instance. But the recommended setup is to generate docs on CI/CD and store the
generated sites to an external storage (e.g. AWS S3 or GCS). TechDocs in your
Backstage instance should turn into read-only mode. Read more details and the
benefits in the [TechDocs Architecture](architecture.md).

Here are the steps needed to switch from the Basic to Recommended setup -

### 1. Prepare a cloud storage

Choose a cloud storage provider like AWS, Google Cloud or Microsoft Azure.
Follow the detailed instructions for
[using cloud storage](using-cloud-storage.md) in TechDocs.

### 2. Publish to storage from CI/CD

Start publishing your TechDocs sites from the CI/CD workflow of each repository
containing the source markdown files. Read the detailed instructions for
[configuring CI/CD](configuring-ci-cd.md).

### 3. Switch TechDocs to read-only mode

In your Backstage instance's `app-config.yaml`, set `techdocs.builder` from
`'local'` to `'external'`. By doing this, TechDocs will not try to generate
docs. Look at [TechDocs configuration](configuration.md) for reference.

## How to use URL Reader in TechDocs Prepare step?

If TechDocs is configured to generate docs, it will first download the
repository associated with the `backstage.io/techdocs-ref` annotation defined in
the Entity's `catalog-info.yaml` file. This is also called the
[Prepare](./concepts.md#techdocs-preparer) step.

There are two kinds of preparers or two ways of downloading these source files

- Preparer 1: Doing a `git clone` of the repository (also known as Common Git
  Preparer)
- Preparer 2: Downloading an archive.zip or equivalent of the repository (also
  known as URL Reader)

If `backstage.io/techdocs-ref` is equal to any of these -

1. `github:https://githubhost.com/org/repo`
2. `gitlab:https://gitlabhost.com/org/repo`
3. `bitbucket:https://bitbuckethost.com/project/repo`
4. `azure/api:https://azurehost.com/org/project`

Then Common Git Preparer will be used i.e. a `git clone`. But the URL Reader is
a much faster way to do this step. Convert the `backstage.io/techdocs-ref`
values to the following -

1. `url:https://githubhost.com/org/repo/tree/<branch_name>`
2. `url:https://gitlabhost.com/org/repo/tree/<branch_name>`
3. `url:https://bitbuckethost.com/project/repo/src/<branch_name>`
4. `url:https://azurehost.com/organization/project/_git/repository`

Note that you can also provide a path to a non-root directory inside the
repository which contains the `docs/` directory.

e.g.
`url:https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend/examples/documented-component`

### Why is URL Reader faster than a git clone?

URL Reader uses the source code hosting provider to download a zip or tarball of
the repository. The archive does not have any git history attached to it. Also
it is a compressed file. Hence the file size is significantly smaller than how
much data git clone has to transfer.

Caveat: Currently TechDocs sites built using URL Reader will be cached for 30
minutes which means they will not be re-built if new changes are made within 30
minutes. This cache invalidation will be replaced by commit timestamp based
implementation very soon.

## How to use a custom TechDocs home page?

### 1st way: TechDocsCustomHome with a custom configuration

As an example, in your main App.tsx:

```tsx
import {
  TechDocsCustomHome,
  PanelType,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { Entity } from '@backstage/catalog-model';

const tabsConfig = [
  {
    label: 'Custom Tab',
    panels: [
      {
        title: 'Custom Documents Cards 1',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsCardGrid' as PanelType,
        // optional, is applied to a container of the panel (excludes header of panel)
        panelCSS: { maxHeight: '400px', overflow:'auto' },
        filterPredicate: (entity: Entity) => !!entity.metadata.annotations?.['customCardAnnotationOne'];
    },
      {
        title: 'Custom Documents Cards 2',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsCardGrid' as PanelType,
        panelCSS: { maxHeight: '400px', overflow:'auto' },
        filterPredicate: (entity: Entity) => !!entity.metadata.annotations?.['customCardAnnotationTwo'];
      },
    ],
  },
  {
    label: 'Overview',
    panels: [
      {
        title: 'Overview',
        description:
          'Explore your internal technical ecosystem through documentation.',
        panelType: 'DocsTable' as PanelType,
        filterPredicate: () => true,
      },
    ],
  },
];

const routes = (
  <FlatRoutes>
    <Route
      path="/docs"
      element={<TechDocsCustomHome tabsConfig={tabsConfig} />}
    />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
  </FlatRoutes>
```

An example of tabsConfig that corresponds to the default documentation home page
can be found at `plugins/techdocs/src/home/components/TechDocsHome.tsx`.

Currently `panelType` has DocsCardGrid and DocsTable available. We currently
recommend that DocsCardGrid can be optionally vertically stacked by setting a
maxHeight using `panelCSS`, and DocsTable to be in a tab by itself.

### 2nd way: Custom home page plugin

A custom home page plugin can be built that uses the components extensions
DocsCardGrid and DocsTable, exported from @backstage/techdocs. They both take a
array of documentation entities ( i.e.have a 'backstage.io/techdocs-ref'
annotation ) as an 'entities' attribute.

For a reference to the React structure of the default home page, please refer to
`plugins/techdocs/src/home/components/TechDocsCustomHome.tsx`.
