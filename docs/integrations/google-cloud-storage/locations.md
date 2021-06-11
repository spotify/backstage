---
id: locations
sidebar_label: Locations
title: Google Cloud Storage Locations
# prettier-ignore
description: Setting up an integration with Google Cloud Storage
---

The Backstage catalog can import entities from a yaml file stored in a GCS
(Google Cloud Storage) bucket. To enable the ingestion of said entities the
`GoogleGcs` integration must be enabled first.

## Configuration

To configure the integration add the appropriate credentials to the Backstage
backend. There are two main ways to do this: by explicitly setting a
`clientEmail` and a `privateKey` or by letting the Google Storage SDK discover
the credentials automatically.

### Explicit credentials

Explicit credentials can be set in the following format:

```yaml
integrations:
  googleGcs:
    clientEmail: ${GCS_CLIENT_EMAIL}
    privateKey: ${GCS_PRIVATE_KEY}
```

Then make sure the environment variables `GCS_CLIENT_EMAIL` and
`GCS_PRIVATE_KEY` are set when you run Backstage.

### Automatic discovery of Google credentials

Since this integration uses the Google Storage SDK, you can also choose to not
provide any explicit credentials and let the SDK discover them automatically.

One of these discovery methods is to provide an environment variable called
`GOOGLE_APPLICATION_CREDENTIALS` and set it to the file path of your JSON
service account key.

For more details and methods to provide credentials to the Google Storage SDK
you can check [this documentation page][google gcs docs].

## Usage

To use this integration to import entities from a GCS bucket go to the Google
console and browse the file you would like to import. Then copy the
`Authenticated URL` and paste it into the text box in the `register component`
form. This url should look like
`https://storage.cloud.google.com/<bucket>/<path>/catalog-info.yaml`.

[google gcs docs]:
  https://cloud.google.com/docs/authentication/production#auth-cloud-implicit-nodejs
