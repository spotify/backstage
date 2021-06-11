---
id: using-cloud-storage
title: Using Cloud Storage for TechDocs generated files
description: Using Cloud Storage for TechDocs generated files
---

In the [TechDocs architecture](./architecture.md) you have the option to choose
where you want to store the Generated static files which TechDocs uses to render
documentation. In both the "Basic" and "Recommended" setup, you can add cloud
storage providers like Google GCS, Amazon AWS S3, etc. By default, TechDocs uses
the local filesystem of the `techdocs-backend` plugin in the "Basic" setup. And
in the recommended setup, having one of the cloud storage is a prerequisite.
Read more on the TechDocs Architecture documentation page.

On this page you can read how to enable them.

## Configuring Google GCS Bucket with TechDocs

Follow the
[official Google Cloud documentation](https://googleapis.dev/nodejs/storage/latest/index.html#quickstart)
for the latest instructions on the following steps involving GCP.

**1. Set `techdocs.publisher.type` config in your `app-config.yaml`**

Set `techdocs.publisher.type` to `'googleGcs'`.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
```

**2. Create a GCS Bucket**

Create a dedicated Google Cloud Storage bucket for TechDocs sites.
techdocs-backend will publish documentation to this bucket. TechDocs will fetch
files from here to serve documentation in Backstage. Note that the bucket names
are globally unique.

Set the config `techdocs.publisher.googleGcs.bucketName` in your
`app-config.yaml` to the name of the bucket you just created.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'name-of-techdocs-storage-bucket'
```

**3a. (Recommended) Authentication using environment variable**

The GCS Node.js client will automatically use the environment variable
`GOOGLE_APPLICATION_CREDENTIALS` to authenticate with Google Cloud. It might
already be set in Compute Engine, Google Kubernetes Engine, etc. Read
https://cloud.google.com/docs/authentication/production for more details.

**3b. Authentication using app-config.yaml**

If you do not prefer (3a) and optionally like to use a service account, you can
follow these steps.

Create a new Service Account and a key associated with it. In roles of the
service account, use "Storage Admin".

If you want to create a custom role, make sure to include both `get` and
`create` permissions for both "Objects" and "Buckets". See
https://cloud.google.com/storage/docs/access-control/iam-permissions

A service account can have many keys. Open your newly created account's page (in
IAM & Admin console), and create a new key. Use JSON format for the key.

A `<GCP-PROJECT-ID-random-uid>.json` file will be downloaded. This is the secret
key TechDocs will use to make API calls. Make it available in your Backstage
server and/or your local development server and set it in the app config
`techdocs.publisher.googleGcs.credentials`.

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'name-of-techdocs-storage-bucket'
      credentials:
        $file: '/path/to/google_application_credentials.json'
```

Note: If you are finding it difficult to make the file
`google_application_credentials.json` available on a server, you could use the
file's content and set as an environment variable. And then use

```yaml
techdocs:
  publisher:
    type: 'googleGcs'
    googleGcs:
      bucketName: 'name-of-techdocs-storage-bucket'
      credentials: ${GOOGLE_APPLICATION_CREDENTIALS}
```

**4. That's it!**

Your Backstage app is now ready to use Google Cloud Storage for TechDocs, to
store and read the static generated documentation files.

## Configuring AWS S3 Bucket with TechDocs

**1. Set `techdocs.publisher.type` config in your `app-config.yaml`**

Set `techdocs.publisher.type` to `'awsS3'`.

```yaml
techdocs:
  publisher:
    type: 'awsS3'
```

**2. Create an S3 Bucket**

Create a dedicated AWS S3 bucket for the storage of TechDocs sites.
[Refer to the official documentation](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html).
[Terraform example](https://github.com/backstage/backstage/blob/master/contrib/terraform/techdocs-s3-storage/terraform.tf).

TechDocs will publish documentation to this bucket and will fetch files from
here to serve documentation in Backstage. Note that the bucket names are
globally unique.

Set the config `techdocs.publisher.awsS3.bucketName` in your `app-config.yaml`
to the name of the bucket you just created.

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'name-of-techdocs-storage-bucket'
```

**3. Create minimal AWS IAM policies to manage TechDocs**

To _write_ TechDocs into the S3 bucket the IAM policy needs to have at a minimum
permissions to:

- `s3:ListBucket` to retrieve bucket metadata
- `s3:PutObject` to upload files to the bucket

To _read_ TechDocs from the S3 bucket the IAM policy needs to have at a minimum
permissions to:

- `s3:ListBucket` - To retrieve bucket metadata
- `s3:GetObject` - To retrieve files from the bucket

**4a. (Recommended) Setup authentication the AWS way, using environment
variables**

You should follow the
[AWS security best practices guide for authentication](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html).

TechDocs needs access to read files and metadata of the S3 bucket. So if you are
creating a policy for a user you want to make sure it is granted access to
ListBucket, GetObject and PutObject.

If the environment variables

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

are set and can be used to access the bucket you created in step 2, they will be
used by the AWS SDK V2 Node.js client for authentication.
[Refer to the official documentation for loading credentials in Node.js from environment variables](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html).

If the environment variables are missing, the AWS SDK tries to read the
`~/.aws/credentials` file for credentials.
[Refer to the official documentation.](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)

If you are using Amazon EC2 instance to deploy Backstage, you do not need to
obtain the access keys separately. They can be made available in the environment
automatically by defining appropriate IAM role with access to the bucket. Read
more in
[official AWS documentation for using IAM roles.](https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html#use-roles).

The AWS Region of the bucket is optional since TechDocs uses AWS SDK V2 and not
V3.

**4b. Authentication using app-config.yaml**

AWS credentials and region can be provided to the AWS SDK via `app-config.yaml`.
If the configs below are present, they will be used over existing `AWS_*`
environment variables and the `~/.aws/credentials` config file.

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'name-of-techdocs-storage-bucket'
      region: ${AWS_REGION}
      credentials:
        accessKeyId: ${AWS_ACCESS_KEY_ID}
        secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
```

Refer to the
[official AWS documentation for obtaining the credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html).

**4c. Authentication using an assumed role** Users with multiple AWS accounts
may want to use a role for S3 storage that is in a different AWS account. Using
the `roleArn` parameter as seen below, you can instruct the TechDocs publisher
to assume a role before accessing S3.

```yaml
techdocs:
  publisher:
    type: 'awsS3'
    awsS3:
      bucketName: 'name-of-techdocs-storage-bucket'
      region: ${AWS_REGION}
      credentials:
        roleArn: arn:aws:iam::123456789012:role/my-backstage-role
```

Note: Assuming a role requires that primary credentials are already configured
at `AWS.config.credentials`. Read more about
[assuming roles in AWS](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html).

**5. That's it!**

Your Backstage app is now ready to use AWS S3 for TechDocs, to store and read
the static generated documentation files. When you start the backend of the app,
you should be able to see
`techdocs info Successfully connected to the AWS S3 bucket` in the logs.

## Configuring Azure Blob Storage Container with TechDocs

Follow the
[official Azure Blob Storage documentation](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json)
for the latest instructions on the following steps involving Azure Blob Storage.

**1. Set `techdocs.publisher.type` config in your `app-config.yaml`**

Set `techdocs.publisher.type` to `'azureBlobStorage'`.

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
```

**2. Create an Azure Blob Storage Container**

Create a dedicated container for TechDocs sites.
[Refer to the official documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal).

TechDocs will publish documentation to this container and will fetch files from
here to serve documentation in Backstage. Note that the container names are
globally unique.

Set the config `techdocs.publisher.azureBlobStorage.containerName` in your
`app-config.yaml` to the name of the container you just created.

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'name-of-techdocs-storage-container'
```

**3a. (Recommended) Authentication using environment variable**

If you do not prefer (3a) and optionally like to use a service account, you can
set the config `techdocs.publisher.azureBlobStorage.credentials.accountName` in
your `app-config.yaml` to the your account name.

The storage blob client will automatically use the environment variable
`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` to authenticate with
Azure Blob Storage.
[Steps to create the service where the variables can be retrieved from](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal).

https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad for more
details.

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'name-of-techdocs-storage-bucket'
      credentials:
        accountName: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_NAME}
```

**3b. Authentication using app-config.yaml**

If you do not prefer (3a) and optionally like to use a service account, you can
follow these steps.

To get credentials, access the Azure Portal and go to "Settings > Access Keys",
and get your Storage account name and Primary Key.
https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key
for more details.

```yaml
techdocs:
  publisher:
    type: 'azureBlobStorage'
    azureBlobStorage:
      containerName: 'name-of-techdocs-storage-bucket'
      credentials:
        accountName: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_NAME}
        accountKey: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_KEY}
```

**4. That's it!**

Your Backstage app is now ready to use Azure Blob Storage for TechDocs, to store
and read the static generated documentation files. When you start the backend of
the app, you should be able to see
`techdocs info Successfully connected to the Azure Blob Storage container` in
the logs.

## Configuring OpenStack Swift Container with TechDocs

Follow the
[official OpenStack Api documentation](https://docs.openstack.org/api-ref/identity/v3/)
for the latest instructions on the following steps involving OpenStack Storage.

**1. Set `techdocs.publisher.type` config in your `app-config.yaml`**

Set `techdocs.publisher.type` to `'openStackSwift'`.

```yaml
techdocs:
  publisher:
    type: 'openStackSwift'
```

**2. Create an OpenStack Swift Storage Container**

Create a dedicated container for TechDocs sites.
[Refer to the official documentation](https://docs.openstack.org/mitaka/user-guide/dashboard_manage_containers.html).

TechDocs will publish documentation to this container and will fetch files from
here to serve documentation in Backstage. Note that the container names are
globally unique.

Set the config `techdocs.publisher.openStackSwift.containerName` in your
`app-config.yaml` to the name of the container you just created.

```yaml
techdocs:
  publisher:
    type: 'openStackSwift'
    openStackSwift:
      containerName: 'name-of-techdocs-storage-container'
```

**3. Authentication using app-config.yaml**

Set the configs in your `app-config.yaml` to point to your container name.

https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail#password-authentication-with-unscoped-authorization
for more details.

```yaml
techdocs:
  publisher:
    type: 'openStackSwift'
    openStackSwift:
      containerName: 'name-of-techdocs-storage-bucket'
      credentials:
        userName: ${OPENSTACK_SWIFT_STORAGE_USERNAME}
        password: ${OPENSTACK_SWIFT_STORAGE_PASSWORD}
      authUrl: ${OPENSTACK_SWIFT_STORAGE_AUTH_URL}
      keystoneAuthVersion: ${OPENSTACK_SWIFT_STORAGE_AUTH_VERSION}
      domainId: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_ID}
      domainName: ${OPENSTACK_SWIFT_STORAGE_DOMAIN_NAME}
      region: ${OPENSTACK_SWIFT_STORAGE_REGION}
```

**4. That's it!**

Your Backstage app is now ready to use OpenStack Swift Storage for TechDocs, to
store and read the static generated documentation files. When you start the
backend of the app, you should be able to see
`techdocs info Successfully connected to the OpenStack Swift Storage container`
in the logs.
