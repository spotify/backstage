# Backstage demo helm charts

This folder contains Helm charts that can easily create a Kubernetes deployment of a demo Backstage app.

### Pre-requisites

These charts depend on the `nginx-ingress` controller being present in the cluster. If it's not already installed you
can run:

```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install nginx-ingress ingress-nginx/ingress-nginx
```

### Installing the charts

After choosing a DNS name where backstage will be hosted create a yaml file for your custom configuration.

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

```shell
git clone https://github.com/backstage/backstage.git
cd contrib/chart/backstage
helm dependency update
helm install -f backstage-mydomain.yaml backstage .
```

This command will deploy the following pieces:

- Backstage frontend
- Backstage backend with scaffolder and auth plugins
- (optional) a PostgreSQL instance
- lighthouse plugin
- ingress

After a few minutes Backstage should be up and running in your cluster under the DNS specified earlier.

Make sure to create the appropriate DNS entry in your infrastructure. To find the public IP address run:

```shell
$ kubectl get ingress
NAME                HOSTS   ADDRESS         PORTS   AGE
backstage-ingress   *       123.1.2.3       80      17m
```

> **NOTE**: this is not a production ready deployment.

## Customization

### Issue certificates

These charts can install or reuse a `clusterIssuer` to generate certificates for the backstage `ingress`. To do that:

1. [Install][install-cert-manager] or make sure [cert-manager][cert-manager] is installed in the cluster.
2. Enable the issuer in the charts. This will first check if there is a `letsencrypt` issuer already deployed in your
   cluster and deploy one if it doesn't exist.

To enable it you need to provide a valid email address in the chart's values:

```yaml
issuer:
  email: me@example.com
  clusterIssuer: 'letsencrypt-prod'
```

By default, the charts use `letsencrypt-staging` so in the above example we instruct helm to use the production issuer
instead.

[cert-manager]: https://cert-manager.io/docs/
[install-cert-manager]: https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm

### Custom PostgreSQL instance

Configuring a connection to an existing PostgreSQL instance is possible through the chart's values.

First create a yaml file with the configuration you want to override, for example `backstage-prod.yaml`:

```yaml
postgresql:
  enabled: false

appConfig:
  app:
    baseUrl: https://backstage-demo.mydomain.com
    title: Backstage
  backend:
    baseUrl: https://backstage-demo.mydomain.com
    cors:
      origin: https://backstage-demo.mydomain.com
    database:
      client: pg
      connection:
        database: backstage_plugin_catalog
        host: <host>
        user: <pg user>
        password: <password>
  lighthouse:
    baseUrl: https://backstage-demo.mydomain.com/lighthouse-api

lighthouse:
  database:
    client: pg
    connection:
      host: <host>
      user: <pg user>
      password: <password>
      database: lighthouse_audit_service
```

For the CA, create a `configMap` named `<release name>-<chart name>-postgres-ca` with a file called `ca.crt`:

```shell
kubectl create configmap my-company-backstage-postgres-ca --from-file=ca.crt"
```

or disable CA mount

```yaml
backend:
  postgresCertMountEnabled: false

lighthouse:
  postgresCertMountEnabled: false
```

> Where the release name contains the chart name "backstage" then only the release name will be used.

Now install the helm chart:

```shell
cd contrib/chart/backstage
helm install -f backstage-prod.yaml my-backstage .
```

### Use your own docker images

The docker images used for the deployment can be configured through the charts values:

```yaml
frontend:
  image:
    repository: <image-name>
    tag: <image-tag>

backend:
  image:
    repository: <image-name>
    tag: <image-tag>

lighthouse:
  image:
    repository: <image-name>
    tag: <image-tag>
```

### Use a private docker repo

Create a docker-registry secret

```shell
kubectl create secret docker-registry <docker_registry_secret_name> # args
```

> For private images on docker hub --docker-server can be set to docker.io

Reference the secret in your chart values

```yaml
dockerRegistrySecretName: <docker_registry_secret_name>
```

### Different namespace

To install the charts a specific namespace use `--namespace <ns>`:

```shell
helm install -f my_values.yaml --namespace demos backstage .
```

### Disable loading of demo data

To deploy backstage with the pre-loaded demo data disable `backend.demoData`:

```shell
helm install -f my_values.yaml --set backend.demoData=false backstage .
```

### Other options

For more customization options take a look at the [values.yaml](/contrib/chart/backstage/values.yaml) file.

## Troubleshooting

Some resources created by these charts are meant to survive after upgrades and even after uninstalls. When
troubleshooting these charts it can be useful to delete these resources between re-installs.

Secrets:

```
<release-name>-postgresql-certs -- contains the certificates used by the deployed PostgreSQL
```

Persistent volumes:

```
data-<release-name>-postgresql-0 -- this is the data volume used by PostgreSQL to store data and configuration
```

> **NOTE**: this volume also stores the configuration for PostgreSQL which includes things like the password for the
> `postgres` user. This means that uninstalling and re-installing the charts with `postgres.enabled` set to `true` and
> auto generated passwords will fail. The solution is to delete this volume with
> `kubectl delete pvc data-<release-name>-postgresql-0`

ConfigMaps:

```
<release-name>-postgres-ca -- contains the generated CA certificate for PostgreSQL when `postgres` is enabled
```

#### Unable to verify signature

```
Backend failed to start up Error: unable to verify the first certificate
    at TLSSocket.onConnectSecure (_tls_wrap.js:1501:34)
    at TLSSocket.emit (events.js:315:20)
    at TLSSocket._finishInit (_tls_wrap.js:936:8)
    at TLSWrap.ssl.onhandshakedone (_tls_wrap.js:710:12) {
  code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
```

This error happens in the backend when it tries to connect to the configured PostgreSQL database and the specified CA is not correct. The solution is to make sure that the contents of the `configMap` that holds the certificate match the CA for the PostgreSQL instance. A workaround is to set `appConfig.backend.database.connection.ssl.rejectUnauthorized` to `false` in the chart's values.

#### Multi-Platform Kubernetes Services

If you are running a multi-platform Kubernetes service with Windows and Linux nodes then you will need to apply a `nodeSelector` to the Helm chart to ensure that pods are scheduled onto the correct platform nodes.

Add the following to your Helm values file:

```yaml
global:
  nodeSelector:
    kubernetes.io/os: linux

# If using Postgres Chart also add
postgresql:
  master:
    nodeSelector:
      kubernetes.io/os: linux
  slave:
    nodeSelector:
      kubernetes.io/os: linux
```

<!-- TODO Add example command when we know the final name of the charts -->

## Uninstalling Backstage

To uninstall Backstage simply run:

```shell
RELEASE_NAME=<release-name> # use `helm list` to find out the name
helm uninstall ${RELEASE_NAME}
kubectl delete pvc data-${RELEASE_NAME}-postgresql-0
kubectl delete secret ${RELEASE_NAME}-postgresql-certs
kubectl delete configMap ${RELEASE_NAME}-postgres-ca
```
