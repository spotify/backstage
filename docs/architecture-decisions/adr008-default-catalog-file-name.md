---
id: adrs-adr008
title: "ADR008: Default Catalog File Name"
description: Architecture Decision Record (ADR) log on Default Catalog File Name
---
## Background

While the spec for the catalog file format is well described in
[ADR002](./adr002-default-catalog-file-format.md), guidance was not provided as
to the name of the catalog file.

Following discussion in
[Issue 1822](https://github.com/backstage/backstage/pull/1822#pullrequestreview-461253670),
a decision was made.

## Name

The catalog file should be named

```shell

catalog-info.yaml

```

This name is a default, **not a requirement**. The catalog file will work with
Backstage regardless of its name.
