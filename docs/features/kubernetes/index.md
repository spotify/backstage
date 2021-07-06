---
id: overview
title: Kubernetes
sidebar_label: Overview
description: Monitoring Kubernetes based services with the software catalog
---

Kubernetes in Backstage is a tool that's designed around the needs of service
owners, not cluster admins. Now developers can easily check the health of their
services no matter how or where those services are deployed — whether it's on a
local host for testing or in production on dozens of clusters around the world.

It will elevate the visibility of errors where identified, and provide drill
down about the deployments, pods, and other objects for a service.

![Kubernetes plugin screenshot](../../assets/features/kubernetes/backstage-k8s-2-deployments.png)

The feature is made up of two plugins:
[`@backstage/plugin-kubernetes`](https://github.com/backstage/backstage/tree/master/plugins/kubernetes)
and
[`@backstage/plugin-kubernetes-backend`](https://github.com/backstage/backstage/tree/master/plugins/kubernetes-backend).

The frontend plugin exposes information to the end user in a digestible way,
while the backend wraps the mechanics to connect to Kubernetes clusters to
collect the relevant information.

## Let's use it!

To get started, first you must [install the Kubernetes plugins](installation.md)
and then [configure them](configuration.md).
