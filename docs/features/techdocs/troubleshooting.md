---
id: troubleshooting
title: Troubleshooting TechDocs
sidebar_label: Troubleshooting
description: Troubleshooting for TechDocs
---

## Failure to clone

TechDocs will fail to clone your docs if you have a git config which overrides
the `https` protocol with `ssh` or something else. Make sure to remove your git
config locally when you try TechDocs.

## MkDocs Build Errors

Using the [TechDocs CLI](https://github.com/backstage/techdocs-cli), you can
troubleshoot MkDocs build issues locally. Note this requires you have Docker
available to launch images. First, `git clone` the target repository locally,
then in the root of the repository, run:

```
npx @techdocs/cli serve
```

For example, if you have forgotten to put an MkDocs configuration file in your
repo, the resulting error will be:

```
npx: installed 278 in 9.089s
[techdocs-preview-bundle] Running local version of Backstage at http://localhost:3000
INFO    -  Building documentation...

Config file '/content/mkdocs.yml' does not exist.
```

When it works, a local copy of both Backstage and your site will be launched
locally:

```
npx: installed 278 in 9.682s
[techdocs-preview-bundle] Running local version of Backstage at http://localhost:3000
INFO    -  Building documentation...
WARNING -  Config value: 'dev_addr'. Warning: The use of the IP address '0.0.0.0'
  suggests a production environment or the use of a proxy to connect to the MkDocs
  server. However, the MkDocs' server is intended for local development purposes only.
  Please use a third party production-ready server instead.
INFO    -  Cleaning site directory
DEBUG   -  Successfully imported extension module "plantuml_markdown".
DEBUG   -  Successfully loaded extension "plantuml_markdown.PlantUMLMarkdownExtension".
INFO    -  Documentation built in 0.23 seconds
[I 210115 19:00:45 server:335] Serving on http://0.0.0.0:8000
INFO    -  Serving on http://0.0.0.0:8000
[I 210115 19:00:45 handlers:62] Start watching changes
INFO    -  Start watching changes
[I 210115 19:00:45 handlers:64] Start detecting changes
INFO    -  Start detecting changes
```

## PlantUML with `svg_object` doesn't render

The [plantuml-markdown](https://pypi.org/project/plantuml-markdown/) MkDocs
plugin available in
[`mkdocs-techdocs-core`](https://github.com/backstage/mkdocs-techdocs-core)
supports different formats for rendering diagrams. TechDocs does however not
support all of them.

The `svg_object` format renders a diagram as an HTML `<object>` tag but this is
not allowed as it enables bad actors to inject malicious content into
documentation pages. See
[CVE-2021-32661](https://github.com/advisories/GHSA-gg96-f8wr-p89f) for more
details.

Instead use `svg_inline` which renders as an `<svg>` tag and provides the same
benefits as `svg_object`.
