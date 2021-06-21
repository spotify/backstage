---
id: installation
title: Google Analytics Installation
sidebar_label: Installation
# prettier-ignore: ""
description: Adding Google Analytics to Your App
---

There is a basic
[Google Analytics](https://marketingplatform.google.com/about/analytics/)
integration built into Backstage. You can enable it by adding the following to
your app configuration:

```yaml
app:
  googleAnalyticsTrackingId: UA-000000-0
```

Replace the tracking ID with the one generated for you after signing up for the
Google Analytics service.

The default behavior is only to send a pageview hit. To record more, review the
[Google Analytics developer documentation](https://developers.google.com/analytics/devguides/collection/gtagjs).
