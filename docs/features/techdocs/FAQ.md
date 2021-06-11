---
id: faqs
title: TechDocs FAQ
sidebar_label: FAQ
description: This page answers frequently asked questions about TechDocs
---

This page answers frequently asked questions about [TechDocs](README.md).

## Technology

- [What static site generator is TechDocs using?](#what-static-site-generator-is-techdocs-using)
- [What is the mkdocs-techdocs-core plugin?](#what-is-the-mkdocs-techdocs-core-plugin)
- [Does TechDocs support file formats other than Markdown (e.g. RST, AsciiDoc)?](#does-techdocs-support-file-formats-other-than-markdown-eg-rst-asciidoc-)

#### What static site generator is TechDocs using?

TechDocs is using [MkDocs](https://www.mkdocs.org/) to build project
documentation under the hood. Documentation built with the
[techdocs-container](https://github.com/backstage/techdocs-container) is using
the MkDocs [Material Theme](https://github.com/squidfunk/mkdocs-material).

#### What is the mkdocs-techdocs-core plugin?

The [mkdocs-techdocs-core](https://github.com/backstage/mkdocs-techdocs-core)
package is a MkDocs Plugin that works like a wrapper around multiple MkDocs
plugins (e.g.
[MkDocs Monorepo Plugin](https://github.com/spotify/mkdocs-monorepo-plugin)) as
well as a selection of Python Markdown extensions that TechDocs supports.

#### Does TechDocs support file formats other than Markdown (e.g. RST, AsciiDoc) ?

Not right now. We are currently using MkDocs to generate the documentation from
source, so the files have to be in Markdown format. However, in the future we
want to support other static site generators which will make it possible to use
other file formats.

#### What should be the value of `backstage.io/techdocs-ref` when using external build and storage?

The value of
[`backstage.io/techdocs-ref`](../software-catalog/well-known-annotations.md#backstageiotechdocs-ref)
metadata annotation is used in the build process of TechDocs. But when
[`techdocs.builder`](./configuration.md) is set to `'external'` in
`app-config.yaml`, the value of the annotation remains unused. However the
annotation should still be present in entity descriptor file (e.g.
`catalog-info.yaml`) for Backstage to know that TechDocs is enabled for the
entity.

#### Is it possible for users to suggest changes or provide feedback on a TechDocs page?

This is supported for TechDocs sites whose source code is hosted in either
GitHub or GitLab. In order to add "edit this page" and "leave feedback" buttons
on a TechDocs page, be sure that you have `repo_url` and `edit_uri` values in
your `mkdocs.yml` files per
[MkDocs instructions](https://www.mkdocs.org/user-guide/configuration).

If the host name of your source code hosting URL does not include `github` or
`gitlab`, an `integrations` entry in your `app-config.yaml` pointed at your
source code provider is also needed (only the `host` key is necessary).
