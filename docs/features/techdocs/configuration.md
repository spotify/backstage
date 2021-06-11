---
id: configuration
title: TechDocs Configuration Options
# prettier-ignore
description: Reference documentation for configuring TechDocs using app-config.yaml
---

Using the `app-config.yaml` in the Backstage app, you can configure TechDocs
using several options. This page serves as a reference to all the available
configuration options for TechDocs.

```yaml
# File: app-config.yaml

techdocs:
  # generators.techdocs can have two values: 'docker' or 'local'. This is to determine how to run the generator - whether to
  # spin up the techdocs-container docker image or to run mkdocs locally (assuming all the dependencies are taken care of).
  # You want to change this to 'local' if you are running Backstage using your own custom Docker setup and want to avoid running
  # into Docker in Docker situation. Read more here
  # https://backstage.io/docs/features/techdocs/getting-started#disable-docker-in-docker-situation-optional

  generators:
    techdocs: 'docker'

  # techdocs.builder can be either 'local' or 'external.
  # If builder is set to 'local' and you open a TechDocs page, techdocs-backend will try to generate the docs, publish to storage
  # and show the generated docs afterwords. This is the "Basic" setup of the TechDocs Architecture.
  # If builder is set to 'external', techdocs-backend will only fetch the docs and will NOT try to generate and publish. In this case of 'external',
  # we assume that docs are being built by an external process (e.g. in the CI/CD pipeline of the repository). This is the "Recommended" setup of
  # the architecture. Read more here https://backstage.io/docs/features/techdocs/architecture

  builder: 'local'

  # techdocs.publisher is used to configure the Storage option, whether you want to use the local filesystem to store generated docs
  # or you want to use External storage providers like Google Cloud Storage, AWS S3, etc.

  publisher:
    # techdocs.publisher.type can be - 'local' or 'googleGcs' or 'awsS3' or 'azureBlobStorage'.
    # When set to 'local', techdocs-backend will create a 'static' directory at its root to store generated documentation files.
    # When set to 'googleGcs', techdocs-backend will use a Google Cloud Storage Bucket to store generated documentation files.
    # When set to 'awsS3', techdocs-backend will use an Amazon Web Service (AWS) S3 bucket to store generated documentation files.

    type: 'local'

    # Required when techdocs.publisher.type is set to 'googleGcs'. Skip otherwise.

    googleGcs:
      # (Required) Cloud Storage Bucket Name
      bucketName: 'techdocs-storage'

      # (Optional) An API key is required to write to a storage bucket.
      # If missing, GOOGLE_APPLICATION_CREDENTIALS environment variable will be used.
      # https://cloud.google.com/docs/authentication/production
      credentials:
        $file: '/path/to/google_application_credentials.json'

    # Required when techdocs.publisher.type is set to 'awsS3'. Skip otherwise.

    awsS3:
      # (Required) AWS S3 Bucket Name
      bucketName: 'techdocs-storage'

      # (Optional) An API key is required to write to a storage bucket.
      # If not set, environment variables or aws config file will be used to authenticate.
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html
      credentials:
        accessKeyId: ${TECHDOCS_AWSS3_ACCESS_KEY_ID_CREDENTIAL}
        secretAccessKey: ${TECHDOCS_AWSS3_SECRET_ACCESS_KEY_CREDENTIAL}

      # (Optional) AWS Region of the bucket.
      # If not set, AWS_REGION environment variable or aws config file will be used.
      # https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
      region: ${AWS_REGION}

      # (Optional) Endpoint URI to send requests to.
      # If not set, the default endpoint is built from the configured region.
      # https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
      endpoint: ${AWS_ENDPOINT}

      # (Optional) Whether to use path style URLs when communicating with S3.
      # Defaults to false.
      # This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used to host tech docs.
      s3ForcePathStyle: false

    # Required when techdocs.publisher.type is set to 'azureBlobStorage'. Skip otherwise.

    azureBlobStorage:
      # (Required) Azure Blob Storage Container Name
      containerName: 'techdocs-storage'

      # (Required) An account name is required to write to a storage blob container.
      # https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-shared-key
      credentials:
        accountName: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_NAME}
        # (Optional) An account key is required to write to a storage container.
        # If missing,AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET environment variable will be used.
        # https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json
        accountKey: ${TECHDOCS_AZURE_BLOB_STORAGE_ACCOUNT_KEY}

  # (Optional and Legacy) TechDocs makes API calls to techdocs-backend using this URL. e.g. get docs of an entity, get metadata, etc.
  # You don't have to specify this anymore.

  requestUrl: http://localhost:7000/api/techdocs

  # (Optional and Legacy) Just another route in techdocs-backend where TechDocs requests the static files from. This URL uses an HTTP middleware
  # to serve files from either a local directory or an External storage provider.
  # You don't have to specify this anymore.

  storageUrl: http://localhost:7000/api/techdocs/static/docs
```
