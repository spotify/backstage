# @backstage/plugin-notifications-backend-module-email

## 0.3.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.7-next.0

## 0.3.26

### Patch Changes

- 663abaf: Updated `nodemailer` to version 10 to address security vulnerabilities in older releases.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0
  - @backstage/catalog-client@1.16.3
  - @backstage/config@1.3.10
  - @backstage/catalog-model@1.10.2
  - @backstage/integration-aws-node@0.2.3
  - @backstage/plugin-catalog-node@2.2.6
  - @backstage/plugin-notifications-common@0.2.5
  - @backstage/plugin-notifications-node@0.2.31

## 0.3.26-next.1

### Patch Changes

- 663abaf: Updated `nodemailer` to version 10 to address security vulnerabilities in older releases.
- Updated dependencies
  - @backstage/backend-plugin-api@1.11.0-next.1
  - @backstage/plugin-catalog-node@2.2.6-next.1
  - @backstage/plugin-notifications-node@0.2.31-next.1

## 0.3.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.10-next.0
  - @backstage/backend-plugin-api@1.10.2-next.0
  - @backstage/integration-aws-node@0.2.3-next.0
  - @backstage/plugin-notifications-common@0.2.5-next.0
  - @backstage/catalog-client@1.16.3-next.0
  - @backstage/catalog-model@1.10.2-next.0
  - @backstage/plugin-catalog-node@2.2.6-next.0
  - @backstage/plugin-notifications-node@0.2.31-next.0

## 0.3.25

### Patch Changes

- 041656a: chore(deps): bump `nodemailer` from 9.0.4 to 9.1.1
- 2a19159: Hardened notification email delivery with format validation and optional `allowedEmailDomains`. Invalid or disallowed addresses are skipped; `allowlistEmailAddresses` and `denylistEmailAddresses` match case-insensitively, allowlist still overrides the domain list, and denied addresses win last.
- 80a548a: Added `resolveNotificationLink` utility function that resolves relative notification links to absolute URLs using a provided base URL. This can be used by notification processor modules to ensure links are absolute before forwarding them to external systems.
- Updated dependencies
  - @backstage/catalog-client@1.16.2
  - @backstage/catalog-model@1.10.1
  - @backstage/config@1.3.9
  - @backstage/plugin-notifications-node@0.2.30
  - @backstage/backend-plugin-api@1.10.1
  - @backstage/integration-aws-node@0.2.2
  - @backstage/plugin-catalog-node@2.2.5
  - @backstage/plugin-notifications-common@0.2.4

## 0.3.25-next.1

### Patch Changes

- 80a548a: Added `resolveNotificationLink` utility function that resolves relative notification links to absolute URLs using a provided base URL. This can be used by notification processor modules to ensure links are absolute before forwarding them to external systems.
- Updated dependencies
  - @backstage/config@1.3.9-next.0
  - @backstage/plugin-notifications-node@0.2.30-next.1
  - @backstage/catalog-client@1.16.2-next.1
  - @backstage/plugin-catalog-node@2.2.5-next.1
  - @backstage/backend-plugin-api@1.10.1-next.1
  - @backstage/integration-aws-node@0.2.2-next.0
  - @backstage/plugin-notifications-common@0.2.4-next.0

## 0.3.25-next.0

### Patch Changes

- 2a19159: Hardened notification email delivery with format validation and optional `allowedEmailDomains`. Invalid or disallowed addresses are skipped; `allowlistEmailAddresses` and `denylistEmailAddresses` match case-insensitively, allowlist still overrides the domain list, and denied addresses win last.
- Updated dependencies
  - @backstage/catalog-client@1.16.2-next.0
  - @backstage/backend-plugin-api@1.10.1-next.0
  - @backstage/plugin-catalog-node@2.2.5-next.0
  - @backstage/plugin-notifications-node@0.2.30-next.0

## 0.3.24

### Patch Changes

- a4e7831: Updated `nodemailer` from v8 to v9. The new major version validates TLS certificates by default when fetching remote content such as attachments or OAuth2 tokens. If your SMTP relay or OAuth2 endpoint uses a self-signed or otherwise untrusted certificate, email delivery may start failing. You can opt out per transport by setting `tls: { rejectUnauthorized: false }` in your nodemailer transport options.
- Updated dependencies
  - @backstage/catalog-model@1.10.0
  - @backstage/backend-plugin-api@1.10.0
  - @backstage/integration-aws-node@0.2.1
  - @backstage/plugin-catalog-node@2.2.4
  - @backstage/plugin-notifications-node@0.2.29

## 0.3.24-next.1

### Patch Changes

- a4e7831: Updated `nodemailer` from v8 to v9. The new major version validates TLS certificates by default when fetching remote content such as attachments or OAuth2 tokens. If your SMTP relay or OAuth2 endpoint uses a self-signed or otherwise untrusted certificate, email delivery may start failing. You can opt out per transport by setting `tls: { rejectUnauthorized: false }` in your nodemailer transport options.
- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.1

## 0.3.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.10.0-next.0
  - @backstage/plugin-catalog-node@2.2.4-next.0
  - @backstage/plugin-notifications-node@0.2.29-next.0

## 0.3.23

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.28
  - @backstage/backend-plugin-api@1.9.3
  - @backstage/catalog-client@1.16.1
  - @backstage/plugin-catalog-node@2.2.3

## 0.3.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.9.3-next.0
  - @backstage/plugin-catalog-node@2.2.3-next.0
  - @backstage/plugin-notifications-node@0.2.28-next.0
  - @backstage/catalog-client@1.16.1-next.0

## 0.3.22

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0
  - @backstage/backend-plugin-api@1.9.2
  - @backstage/plugin-catalog-node@2.2.2
  - @backstage/plugin-notifications-node@0.2.27

## 0.3.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.16.0-next.0
  - @backstage/plugin-catalog-node@2.2.2-next.0
  - @backstage/backend-plugin-api@1.9.2-next.0
  - @backstage/plugin-notifications-node@0.2.27-next.0

## 0.3.21

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.9.0
  - @backstage/integration-aws-node@0.2.0
  - @backstage/backend-plugin-api@1.9.1
  - @backstage/plugin-catalog-node@2.2.1
  - @backstage/plugin-notifications-common@0.2.3
  - @backstage/plugin-notifications-node@0.2.26
  - @backstage/catalog-client@1.15.1
  - @backstage/config@1.3.8

## 0.3.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.2.0-next.1
  - @backstage/backend-plugin-api@1.9.1-next.1

## 0.3.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.3-next.0
  - @backstage/plugin-notifications-node@0.2.26-next.0
  - @backstage/backend-plugin-api@1.9.1-next.0
  - @backstage/catalog-client@1.15.1-next.0
  - @backstage/catalog-model@1.8.1-next.0
  - @backstage/config@1.3.8-next.0
  - @backstage/integration-aws-node@0.1.22-next.0
  - @backstage/plugin-catalog-node@2.2.1-next.0
  - @backstage/types@1.2.2

## 0.3.20

### Patch Changes

- 19ef9fb: build(deps): bump `nodemailer` from 7.0.13 to 8.0.4
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0
  - @backstage/catalog-model@1.8.0
  - @backstage/plugin-catalog-node@2.2.0
  - @backstage/catalog-client@1.15.0
  - @backstage/plugin-notifications-node@0.2.25
  - @backstage/config@1.3.7
  - @backstage/integration-aws-node@0.1.21
  - @backstage/plugin-notifications-common@0.2.2

## 0.3.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.2.0-next.2
  - @backstage/backend-plugin-api@1.9.0-next.2
  - @backstage/catalog-client@1.14.1-next.0
  - @backstage/catalog-model@1.7.8-next.0
  - @backstage/config@1.3.7-next.0
  - @backstage/integration-aws-node@0.1.21-next.0
  - @backstage/plugin-notifications-node@0.2.25-next.2
  - @backstage/plugin-notifications-common@0.2.2-next.0

## 0.3.20-next.1

### Patch Changes

- 19ef9fb: build(deps): bump `nodemailer` from 7.0.13 to 8.0.4
- Updated dependencies
  - @backstage/backend-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-node@2.1.1-next.1
  - @backstage/plugin-notifications-node@0.2.25-next.1

## 0.3.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-node@2.1.1-next.0
  - @backstage/plugin-notifications-node@0.2.25-next.0
  - @backstage/catalog-client@1.14.0
  - @backstage/catalog-model@1.7.7
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.1

## 0.3.19

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0
  - @backstage/catalog-client@1.14.0
  - @backstage/plugin-catalog-node@2.1.0
  - @backstage/catalog-model@1.7.7
  - @backstage/plugin-notifications-node@0.2.24

## 0.3.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.8.0-next.1
  - @backstage/catalog-client@1.14.0-next.2
  - @backstage/plugin-catalog-node@2.1.0-next.2
  - @backstage/plugin-notifications-node@0.2.24-next.2

## 0.3.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.14.0-next.1
  - @backstage/plugin-catalog-node@2.1.0-next.1
  - @backstage/plugin-notifications-node@0.2.24-next.1
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.1

## 0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.1.0-next.0
  - @backstage/backend-plugin-api@1.7.1-next.0
  - @backstage/catalog-client@1.13.1-next.0
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.20
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.1
  - @backstage/plugin-notifications-node@0.2.24-next.0

## 0.3.18

### Patch Changes

- e9eb400: Allow configuring included topics for email notifications.
- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0
  - @backstage/integration-aws-node@0.1.20
  - @backstage/backend-plugin-api@1.7.0
  - @backstage/catalog-client@1.13.0
  - @backstage/plugin-notifications-common@0.2.1
  - @backstage/plugin-notifications-node@0.2.23

## 0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@2.0.0-next.1
  - @backstage/catalog-client@1.12.2-next.0
  - @backstage/backend-plugin-api@1.7.0-next.1
  - @backstage/plugin-notifications-node@0.2.23-next.1

## 0.3.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.21.0-next.0
  - @backstage/integration-aws-node@0.1.20-next.0
  - @backstage/backend-plugin-api@1.7.0-next.0
  - @backstage/plugin-notifications-node@0.2.23-next.0
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0

## 0.3.17

### Patch Changes

- a5d5b3a: SES config for the notification email processor now supports utilizing an ARN for the SES identity when sending an email after the SES SDK V2 update.

  The `sesConfig.fromArn` will set the `fromEmailAddressIdentityArn` option for the SES `SendEmailCommand`. The `sesConfig.sourceArn` field is removed since no equivalent option is available in the send email command options. Setting `sesConfig.sourceArn` will have no effect and log a warning. Example changes:

  ```diff
  notifications:
    processors:
      email:
        transportConfig:
          transport: "ses"
          region: "us-west-2"
        sender: "sender@mycompany.com"
        replyTo: "no-reply@mycompany.com"
        sesConfig:
  -       sourceArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
          fromArn: "arn:aws:ses:us-west-2:123456789012:identity/example.com"
  ```

- b267aea: Updated dependency `@types/nodemailer` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0
  - @backstage/plugin-catalog-node@1.20.1
  - @backstage/plugin-notifications-node@0.2.22

## 0.3.17-next.1

### Patch Changes

- b267aea: Updated dependency `@types/nodemailer` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.20.1-next.1
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/plugin-notifications-node@0.2.22-next.1

## 0.3.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.5.1-next.0
  - @backstage/plugin-catalog-node@1.20.1-next.0
  - @backstage/plugin-notifications-node@0.2.22-next.0
  - @backstage/config@1.3.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1
  - @backstage/catalog-model@1.7.6
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-common@0.2.0

## 0.3.16

### Patch Changes

- 22a5362: Updated `AWS SES` client to version 2 to support `nodemailer` version 7.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0
  - @backstage/plugin-notifications-common@0.2.0
  - @backstage/backend-plugin-api@1.5.0
  - @backstage/plugin-notifications-node@0.2.21
  - @backstage/config@1.3.6
  - @backstage/catalog-model@1.7.6
  - @backstage/integration-aws-node@0.1.19
  - @backstage/catalog-client@1.12.1

## 0.3.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-notifications-common@0.2.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.2
  - @backstage/plugin-notifications-node@0.2.21-next.2

## 0.3.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.20.0-next.1
  - @backstage/backend-plugin-api@1.5.0-next.1
  - @backstage/plugin-notifications-node@0.2.21-next.1

## 0.3.15-next.0

### Patch Changes

- 22a5362: Updated `AWS SES` client to version 2 to support `nodemailer` version 7.
- 05f60e1: Refactored constructor parameter properties to explicit property declarations for compatibility with TypeScript's `erasableSyntaxOnly` setting. This internal refactoring maintains all existing functionality while ensuring TypeScript compilation compatibility.
- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.21-next.0
  - @backstage/config@1.3.6-next.0
  - @backstage/catalog-model@1.7.6-next.0
  - @backstage/integration-aws-node@0.1.19-next.0
  - @backstage/backend-plugin-api@1.4.5-next.0
  - @backstage/catalog-client@1.12.1-next.0
  - @backstage/types@1.2.2
  - @backstage/plugin-catalog-node@1.19.2-next.0
  - @backstage/plugin-notifications-common@0.1.2-next.0

## 0.3.14

### Patch Changes

- b8cf31a: chore(deps): bump `nodemailer` from 6.9.16 to 7.0.7
- f5e0963: Removed unused dependencies
- Updated dependencies
  - @backstage/config@1.3.5
  - @backstage/backend-plugin-api@1.4.4
  - @backstage/integration-aws-node@0.1.18
  - @backstage/plugin-catalog-node@1.19.1
  - @backstage/plugin-notifications-common@0.1.1
  - @backstage/plugin-notifications-node@0.2.20

## 0.3.14-next.1

### Patch Changes

- b8cf31a: chore(deps): bump `nodemailer` from 6.9.16 to 7.0.7
- f5e0963: Removed unused dependencies

## 0.3.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.4-next.0
  - @backstage/integration-aws-node@0.1.18-next.0
  - @backstage/backend-plugin-api@1.4.4-next.0
  - @backstage/plugin-notifications-common@0.1.1-next.0
  - @backstage/plugin-catalog-node@1.19.1-next.0
  - @backstage/plugin-notifications-node@0.2.20-next.0
  - @backstage/catalog-client@1.12.0

## 0.3.13

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.19.0
  - @backstage/catalog-client@1.12.0
  - @backstage/types@1.2.2
  - @backstage/plugin-notifications-node@0.2.19
  - @backstage/backend-plugin-api@1.4.3

## 0.3.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.12.0-next.0
  - @backstage/plugin-catalog-node@1.19.0-next.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-notifications-node@0.2.19-next.1

## 0.3.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.3-next.0
  - @backstage/plugin-catalog-node@1.18.1-next.0
  - @backstage/plugin-notifications-node@0.2.19-next.0

## 0.3.12

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0
  - @backstage/plugin-catalog-node@1.18.0
  - @backstage/plugin-notifications-common@0.1.0
  - @backstage/plugin-notifications-node@0.2.18
  - @backstage/backend-plugin-api@1.4.2

## 0.3.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.11.0-next.0
  - @backstage/plugin-catalog-node@1.18.0-next.0
  - @backstage/plugin-notifications-node@0.2.18-next.0
  - @backstage/backend-plugin-api@1.4.2-next.0
  - @backstage/catalog-model@1.7.5
  - @backstage/config@1.3.3
  - @backstage/integration-aws-node@0.1.17
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.10

## 0.3.11

### Patch Changes

- f92c9fc: Add optional config for `ses` mail options with `sourceArn`, `fromArn`, `configurationSetName`
- Updated dependencies
  - @backstage/config@1.3.3
  - @backstage/catalog-model@1.7.5
  - @backstage/catalog-client@1.10.2
  - @backstage/backend-plugin-api@1.4.1
  - @backstage/integration-aws-node@0.1.17
  - @backstage/plugin-catalog-node@1.17.2
  - @backstage/plugin-notifications-common@0.0.10
  - @backstage/plugin-notifications-node@0.2.17

## 0.3.11-next.1

### Patch Changes

- f92c9fc: Add optional config for `ses` mail options with `sourceArn`, `fromArn`, `configurationSetName`

## 0.3.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.3-next.0
  - @backstage/catalog-model@1.7.5-next.0
  - @backstage/catalog-client@1.10.2-next.0
  - @backstage/integration-aws-node@0.1.17-next.0
  - @backstage/backend-plugin-api@1.4.1-next.0
  - @backstage/plugin-notifications-common@0.0.10-next.0
  - @backstage/plugin-catalog-node@1.17.2-next.0
  - @backstage/plugin-notifications-node@0.2.17-next.0

## 0.3.10

### Patch Changes

- 8a150bf: Internal changes to switch to the non-alpha `catalogServiceRef`
- Updated dependencies
  - @backstage/catalog-client@1.10.1
  - @backstage/plugin-notifications-common@0.0.9
  - @backstage/plugin-catalog-node@1.17.1
  - @backstage/backend-plugin-api@1.4.0
  - @backstage/plugin-notifications-node@0.2.16
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1

## 0.3.10-next.2

### Patch Changes

- 8a150bf: Internal changes to switch to the non-alpha `catalogServiceRef`
- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/plugin-notifications-node@0.2.16-next.1

## 0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.1-next.0
  - @backstage/plugin-notifications-common@0.0.9-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.1
  - @backstage/plugin-notifications-node@0.2.16-next.1
  - @backstage/backend-plugin-api@1.4.0-next.1
  - @backstage/catalog-model@1.7.4
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.16
  - @backstage/types@1.2.1

## 0.3.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.4.0-next.0
  - @backstage/plugin-catalog-node@1.17.1-next.0
  - @backstage/plugin-notifications-node@0.2.16-next.0

## 0.3.9

### Patch Changes

- aa3a63a: Enable the ability to configure the endpoint for the SES connection used in the notifications email module. This enables the configuration of alternate endpoints as required, for example for local testing or alternative stacks.
- Updated dependencies
  - @backstage/catalog-model@1.7.4
  - @backstage/plugin-catalog-node@1.17.0
  - @backstage/backend-plugin-api@1.3.1
  - @backstage/integration-aws-node@0.1.16
  - @backstage/catalog-client@1.10.0
  - @backstage/config@1.3.2
  - @backstage/plugin-notifications-node@0.2.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.3.9-next.3

### Patch Changes

- aa3a63a: Enable the ability to configure the endpoint for the SES connection used in the notifications email module. This enables the configuration of alternate endpoints as required, for example for local testing or alternative stacks.
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.2
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.2
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.2

## 0.3.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.16-next.0
  - @backstage/config@1.3.2
  - @backstage/plugin-notifications-node@0.2.15-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## 0.3.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/plugin-catalog-node@1.17.0-next.0
  - @backstage/backend-plugin-api@1.3.1-next.0
  - @backstage/plugin-notifications-node@0.2.15-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.3.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3
  - @backstage/backend-plugin-api@1.3.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.14

## 0.3.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.3-next.0
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.15
  - @backstage/backend-plugin-api@1.2.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13

## 0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13-next.2

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.1-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.13-next.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.16.1-next.0
  - @backstage/plugin-notifications-node@0.2.13-next.0

## 0.3.6

### Patch Changes

- 6259aa9: Add transport for Azure Communication Service
- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0
  - @backstage/plugin-catalog-node@1.16.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12

## 0.3.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.3
  - @backstage/backend-plugin-api@1.2.0-next.2
  - @backstage/plugin-notifications-node@0.2.12-next.2
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8

## 0.3.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.2.0-next.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-node@1.16.0-next.2
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.1

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.16.0-next.1
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.0

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.2-next.0
  - @backstage/backend-plugin-api@1.2.0-next.0
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.12-next.0

## 0.3.5

### Patch Changes

- bed5f35: Added more examples of the plugin configuration
- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/backend-plugin-api@1.1.1
  - @backstage/catalog-client@1.9.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-catalog-node@1.15.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.11

## 0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/plugin-catalog-node@1.15.1-next.1
  - @backstage/integration-aws-node@0.1.15-next.0
  - @backstage/plugin-notifications-node@0.2.11-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/plugin-notifications-common@0.0.8-next.0

## 0.3.5-next.0

### Patch Changes

- bed5f35: Added more examples of the plugin configuration
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.15.1-next.0
  - @backstage/plugin-notifications-common@0.0.7
  - @backstage/plugin-notifications-node@0.2.11-next.0

## 0.3.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-catalog-node@1.15.0
  - @backstage/catalog-client@1.9.0
  - @backstage/plugin-notifications-node@0.2.10
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/integration-aws-node@0.1.14
  - @backstage/types@1.2.0
  - @backstage/plugin-notifications-common@0.0.7

## 0.3.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/plugin-catalog-node@1.15.0-next.2
  - @backstage/plugin-notifications-node@0.2.10-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration-aws-node@0.1.14-next.0
  - @backstage/types@1.2.0
  - @backstage/plugin-notifications-common@0.0.7-next.0

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.15.0-next.1
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/plugin-notifications-node@0.2.10-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-notifications-common@0.0.6

## 0.3.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/types@1.2.0
  - @backstage/plugin-catalog-node@1.14.1-next.0
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-notifications-node@0.2.10-next.0

## 0.3.3

### Patch Changes

- d52d7f9: Support ISO and ms string forms of durations in config too
- 5d74716: Remove unused backend-common dependency
- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/integration-aws-node@0.1.13
  - @backstage/plugin-catalog-node@1.14.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-notifications-common@0.0.6
  - @backstage/plugin-notifications-node@0.2.9
  - @backstage/catalog-model@1.7.1

## 0.3.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/integration-aws-node@0.1.13-next.0
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-notifications-node@0.2.9-next.3

## 0.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/plugin-catalog-node@1.14.0-next.2
  - @backstage/plugin-notifications-node@0.2.9-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.6-next.0

## 0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.14.0-next.1
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/plugin-notifications-node@0.2.9-next.1

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.14.0-next.0
  - @backstage/plugin-notifications-common@0.0.6-next.0
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-node@0.2.9-next.0

## 0.3.1

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.7
  - @backstage/plugin-catalog-node@1.13.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.7-next.1

## 0.3.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-notifications-node@0.2.7-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.13.1-next.0
  - @backstage/plugin-notifications-common@0.0.5

## 0.3.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/plugin-catalog-node@1.13.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6

## 0.3.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/catalog-client@1.7.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.12.7-next.2
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6-next.2

## 0.3.0-next.1

### Patch Changes

- 5edd344: Refactor to use injected catalog client in the new backend system
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/catalog-client@1.6.7-next.0
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.12.7-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.6-next.1

## 0.3.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-notifications-node@0.2.6-next.0
  - @backstage/catalog-client@1.6.6
  - @backstage/catalog-model@1.6.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.0

### Minor Changes

- def53a7: **BREAKING** Following `NotificationTemplateRenderer` methods now return a Promise and **must** be awaited: `getSubject`, `getText` and `getHtml`.

  Required changes and example usage:

  ```diff
  import { notificationsEmailTemplateExtensionPoint } from '@backstage/plugin-notifications-backend-module-email';
  import { Notification } from '@backstage/plugin-notifications-common';
  +import { getNotificationSubject, getNotificationTextContent, getNotificationHtmlContent } from 'my-notification-processing-library`
  export const notificationsModuleEmailDecorator = createBackendModule({
    pluginId: 'notifications',
    moduleId: 'email.templates',
    register(reg) {
      reg.registerInit({
        deps: {
          emailTemplates: notificationsEmailTemplateExtensionPoint,
        },
        async init({ emailTemplates }) {
          emailTemplates.setTemplateRenderer({
  -          getSubject(notification) {
  +          async getSubject(notification) {
  -            return `New notification from ${notification.source}`;
  +            const subject = await getNotificationSubject(notification);
  +            return `New notification from ${subject}`;
            },
  -          getText(notification) {
  +          async getText(notification) {
  -            return notification.content;
  +            const text = await getNotificationTextContent(notification);
  +            return text;
            },
  -          getHtml(notification) {
  +          async getHtml(notification) {
  -            return `<p>${notification.content}</p>`;
  +            const html = await getNotificationHtmlContent(notification);
  +            return html;
            },
          });
        },
      });
    },
  });
  ```

### Patch Changes

- d55b8e3: Avoid sending broadcast emails as a fallback in case the entity-typed notification user can not be resolved.
- cdb630d: Add support for stream transport for debugging purposes
- 83faf24: Notification email processor supports allowing or denying specific email addresses from receiving notifications
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-notifications-node@0.2.4
  - @backstage/catalog-model@1.6.0
  - @backstage/catalog-client@1.6.6
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.0-next.3

### Patch Changes

- 83faf24: Notification email processor supports allowing or denying specific email addresses from receiving notifications
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/catalog-model@1.6.0-next.0
  - @backstage/catalog-client@1.6.6-next.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.3

## 0.2.0-next.2

### Patch Changes

- cdb630d: Add support for stream transport for debugging purposes
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-notifications-node@0.2.4-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/integration-aws-node@0.1.12
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5

## 0.2.0-next.1

### Minor Changes

- def53a7: **BREAKING** Following `NotificationTemplateRenderer` methods now return a Promise and **must** be awaited: `getSubject`, `getText` and `getHtml`.

  Required changes and example usage:

  ```diff
  import { notificationsEmailTemplateExtensionPoint } from '@backstage/plugin-notifications-backend-module-email';
  import { Notification } from '@backstage/plugin-notifications-common';
  +import { getNotificationSubject, getNotificationTextContent, getNotificationHtmlContent } from 'my-notification-processing-library`
  export const notificationsModuleEmailDecorator = createBackendModule({
    pluginId: 'notifications',
    moduleId: 'email.templates',
    register(reg) {
      reg.registerInit({
        deps: {
          emailTemplates: notificationsEmailTemplateExtensionPoint,
        },
        async init({ emailTemplates }) {
          emailTemplates.setTemplateRenderer({
  -          getSubject(notification) {
  +          async getSubject(notification) {
  -            return `New notification from ${notification.source}`;
  +            const subject = await getNotificationSubject(notification);
  +            return `New notification from ${subject}`;
            },
  -          getText(notification) {
  +          async getText(notification) {
  -            return notification.content;
  +            const text = await getNotificationTextContent(notification);
  +            return text;
            },
  -          getHtml(notification) {
  +          async getHtml(notification) {
  -            return `<p>${notification.content}</p>`;
  +            const html = await getNotificationHtmlContent(notification);
  +            return html;
            },
          });
        },
      });
    },
  });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration-aws-node@0.1.12
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.1

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.4-next.0

## 0.1.3

### Patch Changes

- 4e4ef2b: Move notification processor filter parsing to common package
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/plugin-notifications-node@0.2.3-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-notifications-node@0.2.2-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.4

## 0.1.0

### Minor Changes

- 07a789b: add notification filters

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-notifications-node@0.2.0
  - @backstage/plugin-notifications-common@0.0.4
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.1.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-notifications-common@0.0.4-next.0
  - @backstage/plugin-notifications-node@0.2.0-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-notifications-node@0.2.0-next.2
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.3

## 0.1.0-next.1

### Minor Changes

- 07a789b: add notification filters

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-notifications-node@0.2.0-next.1
  - @backstage/backend-common@0.23.0-next.1

## 0.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-notifications-node@0.1.5-next.0
  - @backstage/catalog-client@1.6.5
  - @backstage/catalog-model@1.5.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.3

## 0.0.1

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- e538b10: Support relative links in notifications sent via email
- dbf2696: Allow sending notifications by email with the new notifications module
- Updated dependencies
  - @backstage/catalog-model@1.5.0
  - @backstage/backend-common@0.22.0
  - @backstage/plugin-notifications-node@0.1.4
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/catalog-client@1.6.5

## 0.0.1-next.1

### Patch Changes

- d541ff6: Fixed email processor `esm` issue and config reading
- e538b10: Support relative links in notifications sent via email
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2

## 0.0.1-next.0

### Patch Changes

- dbf2696: Allow sending notifications by email with the new notifications module
- Updated dependencies
  - @backstage/plugin-notifications-node@0.1.4-next.1
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1
