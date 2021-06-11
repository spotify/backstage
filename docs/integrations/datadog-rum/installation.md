---
id: installation
title: Datadog RUM Installation
sidebar_label: Installation
# prettier-ignore
description: Adding Datadog Real User Monitoring (RUM) to Your App
---

Datadog Real User Monitoring (RUM) allows you to visualize and analyze the
real-time performance and user journeys of your application's individual users.
This is an option to profile and monitor the user experience of your Backstage
installation.

There is a basic [Datadog RUM](https://docs.datadoghq.com/real_user_monitoring/)
integration built into Backstage. You can enable it by adding the following to
your `app-config.yaml`:

```yaml
app:
  datadogRum:
    clientToken: '123456789'
    applicationId: qwerty
  #   site: datadoghq.eu
  #   env: 'staging'
```

The `clientToken` and `applicationId` are generated from the Datadog RUM page
following
[these instructions](https://docs.datadoghq.com/real_user_monitoring/browser/).

There are two optional arguments:

- `site`: The Datadog site of your organization; defaults to `datadoghq.com`
- `env`: The application environment for Datadog events (no default)
