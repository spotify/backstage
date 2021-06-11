---
id: index
title: Deploying Backstage
sidebar_title: Overview
description: Packaging Backstage and deploying to production
---

Backstage provides tooling to build Docker images, but can be deployed with or
without Docker on many different infrastructures. The _best_ way to deploy
Backstage is in _the same way_ you deploy other software at your organization.

This documentation shows common examples that may be useful when deploying
Backstage for the first time, or for those without established deployment
practices.

> Note: The _easiest_ way to explore Backstage is to visit the
> [live demo site](https://demo.backstage.io).

At Spotify, we deploy software generally by:

1. Building a Docker image
2. Storing the Docker image on a container registry
3. Referencing the image in a Kubernetes Deployment YAML
4. Applying that Deployment to a Kubernetes cluster

This method is covered in [Building a Docker image](docker.md) and
[Deploying with Kubernetes](k8s.md).

There is also an example of deploying on [Heroku](heroku.md), which only
requires the first two steps.

An example of deploying Backstage with a [Helm chart](helm.md), a common pattern
in AWS, is also available. There is also a contrib guide to deploying Backstage
with
[AWS Fargate and Aurora PostgreSQL](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/aws-fargate-deployment.md)

Please consider contributing other deployment guides if you get Backstage set up
on common infrastructure, it would be a great benefit to the community.

If you need to run Backstage behind a corporate proxy, this
[contributed guide](https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/help-im-behind-a-corporate-proxy.md)
may help.
