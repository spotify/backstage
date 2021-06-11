---
id: heroku
title: Deploying with Heroku
sidebar_label: Heroku
description: How to deploy Backstage to Heroku
---

Heroku is a Platform as a Service (PaaS) designed to handle application
deployment in a hands-off way. Heroku supports container deployment of Docker
images, a natural fit for Backstage.

## Configuring the CLI

First, install the
[heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) and login:

```shell
$ heroku login
```

Heroku runs a container registry on `registry.heroku.com`. To push Backstage
Docker images, log in to the container registry also:

```shell
$ heroku container:login
```

You _might_ also need to set your Heroku app's stack to `container`:

```bash
$ heroku stack:set container -a <your-app>
```

## Push and deploy a Docker image

Now we can push a Backstage [Docker image](docker.md) to Heroku's container
registry and release it to the `web` worker:

```bash
$ heroku container:push web -a <your-app>
$ heroku container:release web -a <your-app>
```

Now you should have Backstage up and running! 🎉
