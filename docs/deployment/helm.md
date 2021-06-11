---
id: helm
title: Deploying with Helm
description: How to deploy Backstage with Helm and Kubernetes
sidebar_label: Helm
---

An example Backstage app can be deployed in Kubernetes using the
[Backstage Helm charts](https://github.com/backstage/backstage/tree/master/contrib/chart/backstage).

First, choose a DNS name where Backstage will be hosted, and create a YAML file
for your custom configuration.

```yaml
appConfig:
  app:
    baseUrl: https://backstage.mydomain.com
    title: Backstage
  backend:
    baseUrl: https://backstage.mydomain.com
    cors:
      origin: https://backstage.mydomain.com
  lighthouse:
    baseUrl: https://backstage.mydomain.com/lighthouse-api
  techdocs:
    storageUrl: https://backstage.mydomain.com/api/techdocs/static/docs
    requestUrl: https://backstage.mydomain.com/api/techdocs
```

Then use it to run:

```bash
git clone https://github.com/backstage/backstage.git
cd backstage/contrib/chart/backstage
helm dependency update
helm install -f backstage-mydomain.yaml backstage .
```

This command will deploy the following pieces:

- Backstage frontend
- Backstage backend with scaffolder and auth plugins
- (optional) a PostgreSQL instance
- lighthouse plugin
- ingress

After a few minutes Backstage should be up and running in your cluster under the
DNS specified earlier.

Make sure to create the appropriate DNS entry in your infrastructure. To find
the public IP address run:

```bash
$ kubectl get ingress
NAME                HOSTS   ADDRESS         PORTS   AGE
backstage-ingress   *       123.1.2.3       80      17m
```

> **NOTE**: this is not a production ready deployment.

For more information on how to customize the deployment check the
[README](https://github.com/backstage/backstage/tree/master/contrib/chart/backstage/README.md).
