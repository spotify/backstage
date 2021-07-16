---
'@backstage/techdocs-common': minor
'@backstage/plugin-techdocs-backend': minor
---

Introduce the annotation `backstage.io/techdocs-ref: <relative-target>` as an alias for `backstage.io/techdocs-ref: dir:<relative-target>`.
This annotation works with both the basic and the recommended flow, however, it will be most useful with the basic approach.

In addition, this change removes the support of the deprecated `github`, `gitlab`, and `azure/api` locations from the `dir` reference preparer.

#### Example Usage

The new annotation is convenient if the documentation is stored in the same location, i.e. the same git repository, as the `catalog-info.yaml`.
While it is still supported to add full URLs such as `backstage.io/techdocs-ref: url:https://...` for custom setups, documentation is mostly stored in the same repository as the entity definition.
By automatically resolving the target relative to the registration location of the entity, the configuration overhead for this default setup is minimized.
Since it leverages the `@backstage/integrations` package for the URL resolution, this is compatible with every supported source.

Consider the following examples:

> Note that the short version `<target>` is only an alias for the still supported `dir:<target>`.

1. "I have a repository with a single `catalog-info.yaml` and a TechDocs page in the root folder!"

```
https://github.com/backstage/example/tree/main/
 |- catalog-info.yaml
 |  > apiVersion: backstage.io/v1alpha1
 |  > kind: Component
 |  > metadata:
 |  >   name: example
 |  >   annotations:
 |  >     backstage.io/techdocs-ref: . # -> same folder
 |  > spec: {}
 |- docs/
 |- mkdocs.yml
```

2. "I have a repository with a single `catalog-info.yaml` and my TechDocs page in located in a folder!"

```
https://bitbucket.org/my-owner/my-project/src/master/
 |- catalog-info.yaml
 |  > apiVersion: backstage.io/v1alpha1
 |  > kind: Component
 |  > metadata:
 |  >   name: example
 |  >   annotations:
 |  >     backstage.io/techdocs-ref: ./some-folder # -> subfolder
 |  > spec: {}
 |- some-folder/
   |- docs/
   |- mkdocs.yml
```

3. "I have a mono repository that hosts multiple components!"

```
https://dev.azure.com/organization/project/_git/repository
 |- my-1st-module/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: my-1st-module
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: . # -> same folder
   |  > spec: {}
   |- docs/
   |- mkdocs.yml
 |- my-2nd-module/
   |- catalog-info.yaml
   |  > apiVersion: backstage.io/v1alpha1
   |  > kind: Component
   |  > metadata:
   |  >   name: my-2nd-module
   |  >   annotations:
   |  >     backstage.io/techdocs-ref: . # -> same folder
   |  > spec: {}
   |- docs/
   |- mkdocs.yml
 |- catalog-info.yaml
 |  > apiVersion: backstage.io/v1alpha1
 |  > kind: Location
 |  > metadata:
 |  >   name: example
 |  > spec:
 |  >   targets:
 |  >     - ./*/catalog-info.yaml
```
