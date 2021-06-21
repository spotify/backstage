---
id: template-legacy
title: Writing Templates (Legacy)
# prettier-ignore: ""
description: "Old documentation describing the backstage.io/v1alpha1 format of the Template Schema"
---

## Kind: Template

Describes the following entity kind:

| Field        | Value                   |
| ------------ | ----------------------- |
| `apiVersion` | `backstage.io/v1alpha1` |
| `kind`       | `Template`              |

A Template describes a skeleton for use with the Scaffolder. It is used for
describing what templating library is supported, and also for documenting the
variables that the template requires using
[JSON Forms Schema](https://jsonforms.io/).

Descriptor files for this kind may look as follows.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: react-ssr-template
  title: React SSR Template
  description:
    Next.js application skeleton for creating isomorphic web applications.
  tags:
    - recommended
    - react
spec:
  owner: web@example.com
  templater: cookiecutter
  type: website
  path: '.'
  schema:
    required:
      - component_id
      - description
    properties:
      component_id:
        title: Name
        type: string
        description: Unique name of the component
      description:
        title: Description
        type: string
        description: Description of the component
```

In addition to the [common envelope metadata](#common-to-all-kinds-the-metadata)
shape, this kind has the following structure.

### `apiVersion` and `kind` [required]

Exactly equal to `backstage.io/v1alpha1` and `Template`, respectively.

### `metadata.title` [required]

The nice display name for the template as a string, e.g. `React SSR Template`.
This field is required as is used to reference the template to the user instead
of the `metadata.name` field.

### `metadata.tags` [optional]

A list of strings that can be associated with the template, e.g.
`['recommended', 'react']`.

This list will also be used in the frontend to display to the user so you can
potentially search and group templates by these tags.

### `spec.type` [optional]

The type of component as a string, e.g. `website`. This field is optional but
recommended.

The software catalog accepts any type value, but an organization should take
great care to establish a proper taxonomy for these. Tools including Backstage
itself may read this field and behave differently depending on its value. For
example, a website type component may present tooling in the Backstage interface
that is specific to just websites.

The current set of well-known and common values for this field is:

- `service` - a backend service, typically exposing an API
- `website` - a website
- `library` - a software library, such as an npm module or a Java library

### `spec.templater` [required]

The templating library that is supported by the template skeleton as a string,
e.g `cookiecutter`.

Different skeletons will use different templating syntax, so it's common that
the template will need to be run with a particular piece of software.

This key will be used to identify the correct templater which is registered into
the `TemplatersBuilder`.

The values which are available by default are:

- `cookiecutter` - [cookiecutter](https://github.com/cookiecutter/cookiecutter).

### `spec.path` [optional]

The string location where the templater should be run if it is not on the same
level as the `template.yaml` definition, e.g. `./cookiecutter/skeleton`.

This will set the `cwd` when running the templater to the folder path that you
specify relative to the `template.yaml` definition.

This is also particularly useful when you have multiple template definitions in
the same repository but only a single `template.yaml` registered in backstage.
