---
id: k8s
title: Deploying with Kubernetes
sidebar_label: Kubernetes
description: How to deploy Backstage to a Kubernetes cluster
---

[Kubernetes](https://kubernetes.io/) is a system for deploying, scaling and
managing containerized applications. Backstage is designed to fit this model and
run as a stateless application with an external PostgreSQL database.

There are many different tools and patterns for Kubernetes clusters, so the best
way to deploy to an existing Kubernetes setup is _the same way_ you deploy
everything else.

This guide covers basic Kubernetes definitions needed to get Backstage up and
running in a typical cluster. The object definitions might look familiar, since
the Backstage software catalog
[also uses](../features/software-catalog/descriptor-format.md) the Kubernetes
object format for its entity definition files!

## Testing locally

To test out these concepts locally before deploying to a production Kubernetes
cluster, first install [kubectl](https://kubernetes.io/docs/tasks/tools/), the
Kubernetes command-line tool.

Next, install [minikube](https://minikube.sigs.k8s.io/docs/start/). This creates
a single-node Kubernetes cluster on your local machine:

```shell
# Assumes Mac + Homebrew; see the minikube site for other installations
$ brew install minikube
$ minikube start

...
Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default.
```

Now you can run `kubectl` commands and have changes applied to the minikube
cluster. You should be able to see the `kube-system` Kubernetes pods running:

```shell
$ kubectl get pods -A
```

When you're done with the tutorial, use `minikube stop` to halt the cluster and
free up resources.

## Creating a namespace

Deployments in Kubernetes are commonly assigned to their own
[namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
to isolate services in a multi-tenant environment.

This can be done through `kubectl` directly:

```shell
$ kubectl create namespace backstage
namespace/backstage created
```

Alternatively, create and apply a Namespace definition:

```yaml
# kubernetes/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: backstage
```

```shell
$ kubectl apply -f kubernetes/namespace.yaml
namespace/backstage created
```

## Creating the PostgreSQL database

Backstage in production uses PostgreSQL as a database. To isolate the database
from Backstage app deployments, we can create a separate Kubernetes deployment
for PostgreSQL.

### Creating a PostgreSQL secret

First, create a Kubernetes Secret for the PostgreSQL username and password. This
will be used by both the PostgreSQL database and Backstage deployments:

```yaml
# kubernetes/postgres-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secrets
  namespace: backstage
type: Opaque
data:
  POSTGRES_USER: YmFja3N0YWdl
  POSTGRES_PASSWORD: aHVudGVyMg==
```

The data in Kubernetes secrets are base64-encoded. The values can be generated
on the command line:

```shell
$ echo -n "backstage" | base64
YmFja3N0YWdl
```

> Note: Secrets are base64-encoded, but not encrypted. Be sure to enable
> [Encryption at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
> for the cluster. For storing secrets in Git, consider
> [SealedSecrets or other solutions](https://learnk8s.io/kubernetes-secrets-in-git).

The secrets can now be applied to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/postgres-secrets.yaml
secret/postgres-secrets created
```

### Creating a PostgreSQL persistent volume

PostgreSQL needs a persistent volume to store data; we'll create one along with
a `PersistentVolumeClaim`. In this case, we're claiming the whole volume - but
claims can ask for only part of a volume as well.

```yaml
# kubernetes/postgres-storage.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-storage
  namespace: backstage
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 2G
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: '/mnt/data'
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-storage-claim
  namespace: backstage
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2G
```

This file contains definitions for two different kinds, separated by a line with
a triple dash. This syntax is helpful if you want to consolidate related
Kubernetes definitions in a single file and apply them at the same time.

Note the volume `type: local`; this creates a volume using local disk on
Kubernetes nodes. More likely in a production scenario, you'd want to use a more
highly available
[type of PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes).

Apply the storage volume and claim to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/postgres-storage.yaml
persistentvolume/postgres-storage created
persistentvolumeclaim/postgres-storage-claim created
```

### Creating a PostgreSQL deployment

Now we can create a Kubernetes Deployment descriptor for the PostgreSQL database
deployment itself:

```yaml
# kubernetes/postgres.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: backstage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:13.2-alpine
          imagePullPolicy: 'IfNotPresent'
          ports:
            - containerPort: 5432
          envFrom:
            - secretRef:
                name: postgres-secrets
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgresdb
      volumes:
        - name: postgresdb
          persistentVolumeClaim:
            claimName: postgres-storage-claim
```

If you're not used to Kubernetes, this is a lot to take in. We're describing a
Deployment (one or more instances of an application) that we'd like Kubernetes
to know about in the `metadata` block.

The `spec` block describes the desired state. Here we've requested Kubernetes
create 1 replica (running instance of PostgreSQL), and to create the replica
with the given pod `template`, which again contains Kubernetes metadata and a
desired state. The template `spec` shows one container, created from the
[published](https://hub.docker.com/_/postgres) `postgres:13.2-alpine` Docker
image.

Note the `envFrom` and `secretRef` - this tells Kubernetes to fill environment
variables in the container with values from the Secret we created. We've also
referenced the volume created for the deployment, and given it the mount path
expected by PostgreSQL.

Apply the PostgreSQL deployment to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/postgres.yaml
deployment.apps/postgres created

$ kubectl get pods --namespace=backstage
NAME                        READY   STATUS    RESTARTS   AGE
postgres-56c86b8bbc-66pt2   1/1     Running   0          21s
```

Verify the deployment by connecting to the pod:

```shell
$ kubectl exec -it --namespace=backstage postgres-56c86b8bbc-66pt2 -- /bin/bash
bash-5.1# psql -U $POSTGRES_USER
psql (13.2)
backstage=# \q
bash-5.1# exit
```

### Creating a PostgreSQL service

The database pod is running, but how does another pod connect to it?

Kubernetes pods are transient - they can be killed, restarted, or created
dynamically. Therefore we don't want to try to connect to pods directly, but
rather create a Kubernetes Service. Services keep track of pods and direct
traffic to the right place.

The final step for our database is to create the service descriptor:

```yaml
# kubernetes/postgres-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: backstage
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
```

Apply the service to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/postgres-service.yaml
service/postgres created

$ kubectl get services --namespace=backstage
NAME       TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
postgres   ClusterIP   10.96.5.103   <none>        5432/TCP   29s
```

## Creating the Backstage instance

Now that we have PostgreSQL up and ready to store data, we can create the
Backstage instance. This follows similar steps as the PostgreSQL deployment.

### Creating a Backstage secret

For any Backstage configuration secrets, such as authorization tokens, we can
create a similar Kubernetes Secret as we did
[for PostgreSQL](#creating-a-postgresql-secret), remembering to base64 encode
the values:

```yaml
# kubernetes/backstage-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: backstage-secrets
  namespace: backstage
type: Opaque
data:
  GITHUB_TOKEN: VG9rZW5Ub2tlblRva2VuVG9rZW5NYWxrb3ZpY2hUb2tlbg==
```

Apply the secret to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/backstage-secrets.yaml
secret/backstage-secrets created
```

### Creating a Backstage deployment

To create the Backstage deployment, first create a [Docker image](docker.md).
We'll use this image to create a Kubernetes deployment. For this example, we'll
use the standard host build with the frontend bundled and served from the
backend.

First, create a Kubernetes Deployment descriptor:

```yaml
# kubernetes/backstage.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backstage
  namespace: backstage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backstage
  template:
    metadata:
      labels:
        app: backstage
    spec:
      containers:
        - name: backstage
          image: backstage:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 7000
          envFrom:
            - secretRef:
                name: postgres-secrets
            - secretRef:
                name: backstage-secrets
# Uncomment if health checks are enabled in your app:
# https://backstage.io/docs/plugins/observability#health-checks
#          readinessProbe:
#            httpGet:
#              port: 7000
#              path: /healthcheck
#          livenessProbe:
#            httpGet:
#              port: 7000
#              path: /healthcheck
```

For production deployments, the `image` reference will usually be a full URL to
a repository on a container registry (for example, ECR on AWS).

For testing locally with `minikube`, you can point the local Docker daemon to
the `minikube` internal Docker registry and then rebuild the image to install
it:

```shell
$ eval $(minikube docker-env)
$ yarn build-image --tag backstage:1.0.0
```

There is no special wiring needed to access the PostgreSQL service. Since it's
running on the same cluster, Kubernetes will inject `POSTGRES_SERVICE_HOST` and
`POSTGRES_SERVICE_PORT` environment variables into our Backstage container.
These can be used in the Backstage `app-config.yaml` along with the secrets:

```yaml
backend:
  database:
    client: pg
    connection:
      host: ${POSTGRES_SERVICE_HOST}
      port: ${POSTGRES_SERVICE_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```

Make sure to rebuild the Docker image after applying `app-config.yaml` changes.

Apply this Deployment to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/backstage.yaml
deployment.apps/backstage created

$ kubectl get deployments --namespace=backstage
NAME        READY   UP-TO-DATE   AVAILABLE   AGE
backstage   1/1     1            1           1m
postgres    1/1     1            1           10m

$ kubectl get pods --namespace=backstage
NAME                                 READY   STATUS    RESTARTS   AGE
backstage-54bfcd6476-n2jkm           1/1     Running   0          58s
postgres-56c86b8bbc-66pt2            1/1     Running   0          9m
```

Beautiful! 🎉 The deployment and pod are running in the cluster. If you run into
any trouble, check the container logs from the pod:

```shell
# -f to tail, <pod> -c <container>
$ kubectl logs --namespace=backstage -f backstage-54bfcd6476-n2jkm -c backstage
```

### Creating a Backstage service

Like the [PostgreSQL service](#creating-a-postgresql-service) above, we need to
create a Kubernetes Service for Backstage to handle connecting requests to the
correct pods.

Create the Kubernetes Service descriptor:

```yaml
# kubernetes/backstage-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backstage
  namespace: backstage
spec:
  selector:
    app: backstage
  ports:
    - name: http
      port: 80
      targetPort: http
```

The `selector` here is telling the Service which pods to target, and the port
mapping translates normal HTTP port 80 to the backend http port (7000) on the
pod.

Apply this Service to the Kubernetes cluster:

```shell
$ kubectl apply -f kubernetes/backstage-service.yaml
service/backstage created
```

Now we have a fully operational Backstage deployment! 🎉 For a _**grand
reveal**_, you can forward a local port to the service:

```shell
$ sudo kubectl port-forward --namespace=backstage svc/backstage 80:80
Forwarding from 127.0.0.1:80 -> 7000
```

This shows port 7000 since `port-forward` doesn't _really_ support services, so
it cheats by looking up the first pod for a service and connecting to the mapped
pod port.

Note that `app.baseUrl` and `backend.baseUrl` in your `app-config.yaml` should
match what we're forwarding here (port omitted in this example since we're using
the default HTTP port 80):

```yaml
# app-config.yaml
app:
  baseUrl: http://localhost

organization:
  name: Spotify

backend:
  baseUrl: http://localhost
  listen:
    port: 7000
  cors:
    origin: http://localhost
```

If you're using an [auth provider](../auth/index.md), it should also have this
address configured for the authentication pop-up to work properly.

Now you can open a browser on your machine to [localhost](http://localhost) and
browse your Kubernetes-deployed Backstage instance. 🚢🚢🚢

## Further steps

This is most of the way to a full production deployment of Backstage on
Kubernetes. There's a few additional steps to that will likely be needed beyond
the scope of this document.

### Set up a more reliable volume

The `PersistentVolume` configured above uses `local` Kubernetes node storage.
This should be replaced with a cloud volume, network attached storage, or
something more persistent beyond a Kubernetes node.

### Expose the Backstage service

The Kubernetes Service is not exposed for external connections from outside the
cluster. This is generally done with a Kubernetes
[ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) or
an
[external load balancer](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/).

### Update the Deployment image

To update the Kubernetes deployment to a newly published version of your
Backstage Docker image, update the image tag reference in `backstage.yaml` and
then apply the changes with `kubectl apply -f kubernetes/backstage.yaml`.

For production purposes, this image tag will generally be a full-fledged URL
pointing to a container registry where built Docker images are hosted. This can
be hosted internally in your infrastructure, or a managed one offered by a cloud
provider.
