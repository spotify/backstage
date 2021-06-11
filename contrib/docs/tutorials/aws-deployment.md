# Deploying Backstage on AWS using ECR and EKS

Backstage documentation shows how to build a [Docker
image](https://backstage.io/docs/getting-started/deployment-docker); this
tutorial shows how to deploy that Docker image to AWS using Elastic Container
Registry (ECR) and Elastic Kubernetes Service (EKS). Amazon also supports
deployments with Helm, covered in the [Helm
Kubernetes](../kubernetes/basic_kubernetes_example_with_helm) example.

The basic workflow for this method is to build a Backstage Docker image, upload
the new version to a container registry, and update a Kubernetes deployment with
the new image.

## Create a container registry

To create an Elastic Container Registry on AWS, go to the [AWS ECR
console](https://console.aws.amazon.com/ecr/repositories).

Click `Create repository` and give the repository a name, like `backstage`.

## Add an ECR IAM user

To push to this new ECR repository, there must be an IAM user with
`AmazonEC2ContainerRegistry` permission.

Go to [AWS IAM console](https://console.aws.amazon.com/iam/home) and select
`Users`.

1. Click `Add User`
2. Set the username to something like `ecr-publisher` and select `Programmatic access` only.
3. For `Permissions`, you can either create a new group or attach policies
   directly to the user with `AmazonEC2ContainerRegistryFullAccess`.
4. Finish creating the user; an access key ID and secret access key will be
   generated.

## Publish a Backstage build

Follow the [Docker
image](https://backstage.io/docs/getting-started/deployment-docker)
documentation to build a new Backstage Docker image:

```shell
$ yarn build
$ yarn build-image --tag backstage
```

Next, configure the [AWS CLI](https://aws.amazon.com/cli/) to use the
`ecr-publisher` user you created:

```shell
$ aws configure
AWS Access Key ID: <access key ID>
AWS Secret Access Key: <secret access key>
Default region name: <region for your ECR repository>
```

Now you can use the AWS CLI to push the built image to the ECR repository. It's
a good practice to use a specific version tag as well as `latest` when pushing;
more about [Semver tagging
here](https://medium.com/@mccode/using-semantic-versioning-for-docker-image-tags-dfde8be06699).

Go to the [AWS ECR console](https://console.aws.amazon.com/ecr/repositories) and
click on your repository, then `View push commands`. This will show the
repository URL to push and some sample commands.

```shell
# Copy from push command window
$ aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <repo_url>
Login Succeeded

$ docker tag backstage:latest <repo_url>/backstage:latest
$ docker push <repo_url>/backstage:latest

$ docker tag backstage:latest <repo_url>/backstage:1.0.0
$ docker push <repo_url>/backstage:1.0.0
```

These will take a few minutes to upload the Docker images, then you can see
the image with `latest, 1.0.0` tags in the ECR repository. Now you can create a
Kubernetes deployment based on this image.

## Deploy to an EKS cluster

Creating an Elastic Kubernetes Service (EKS) cluster is beyond the scope of this
document, but it can be as easy as `eksctl create cluster` documented in the
[AWS EKS getting started
guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html),
which uses a Cloudformation template to create the necessary resources.

To deploy the Docker image to EKS, follow the [Kubernetes
guide](https://backstage.io/docs/deployment/k8s#creating-the-backstage-instance)
but set the Backstage deployment `image` to the ECR repository URL:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backstage
  namespace: backstage
spec:
  ...
  template:
    metadata:
      labels:
        app: backstage
    spec:
      containers:
        - image: <repo_url>/backstage:1.0.0
          imagePullPolicy: Always
          ...
```

Create the [Service
descriptor](https://backstage.io/docs/deployment/k8s#creating-a-backstage-service)
as well, and apply these Kubernetes definitions to the EKS cluster to complete
the Backstage deployment:

```shell
$ kubectl apply -f kubernetes/backstage.yaml
$ kubectl apply -f kubernetes/backstage-service.yaml
```

Now you can see your Backstage workload running from the [EKS
console](https://console.aws.amazon.com/eks/home).

## Further steps

### Exposing Backstage with a load balancer

To make the service useful, we need to expose the workload with a load balancer.
Follow the [Application load balancing on
EKS](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html) guide to
set up a Load Balancer controller and Kubernetes ingress to your application.

This is ultimately a `kubectl apply` with an ingress definition:

```yaml
# kubernetes/backstage-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  namespace: default
  name: backstage-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backstage-backend
                port:
                  number: 80
```
