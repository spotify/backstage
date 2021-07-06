---
id: configuration
title: Software Template Configuration
sidebar_label: Configuration
description: Configuration options for Backstage Software Templates
---

Backstage software templates create source code, so your Backstage application
needs to be set up to allow repository creation.

This is done in your `app-config.yaml` by adding
[Backstage integrations](https://backstage.io/docs/integrations/) for the
appropriate source code repository for your organization.

> Note: Integrations may already be set up as part of your `app-config.yaml`.

The next step is to add
[add templates](http://backstage.io/docs/features/software-templates/adding-templates)
to your Backstage app.

### GitHub

For GitHub, you can configure who can see the new repositories that are created
by specifying `visibility` option. Valid options are `public`, `private` and
`internal`. The `internal` option is for GitHub Enterprise clients, which means
public within the enterprise.

```yaml
scaffolder:
  github:
    visibility: public # or 'internal' or 'private'
```

### Disabling Docker in Docker situation (Optional)

Software Templates use
[Cookiecutter](https://github.com/cookiecutter/cookiecutter) as a templating
library. By default it will use the
[scaffolder-backend/Cookiecutter](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/scripts/Cookiecutter.dockerfile)
docker image.

If you are running Backstage from a Docker container and you want to avoid
calling a container inside a container, you can set up Cookiecutter in your own
image, this will use the local installation instead.

You can do so by including the following lines in the last step of your
`Dockerfile`:

```Dockerfile
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install cookiecutter
```
