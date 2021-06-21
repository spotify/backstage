---
id: techdocs-overview
title: TechDocs Documentation
sidebar_label: Overview
# prettier-ignore: ""
description: "TechDocs is Spotify’s homegrown docs-like-code solution built directly into Backstage"
---

## What is it?

<!-- Intro, backstory, etc.: -->

TechDocs is Spotify’s homegrown docs-like-code solution built directly into
Backstage. This means engineers write their documentation in Markdown files
which live together with their code.

Today, it is one of the core products in Spotify’s developer experience offering
with 2,400+ documentation sites and 1,000+ engineers using it daily. Read more
about TechDocs and the philosophy in its
[announcement blog post](https://backstage.io/blog/2020/09/08/announcing-tech-docs).
🎉

## Features

- Deploy TechDocs no matter how your software environment is set up.
- Discover your Service's technical documentation from the Service's page in
  Backstage Catalog.
- Create documentation-only sites for any purpose by just writing Markdown.
- Explore and take advantage of the large ecosystem of
  [MkDocs plugins](https://www.mkdocs.org/user-guide/plugins/) to create a rich
  reading experience.
- Search for and find docs (coming soon).
- Highlight text and raise an Issue to create feedback loop to drive quality
  documentation (future).
- Contribute to and deploy from a marketplace of TechDocs widgets (future).

## Platforms supported

See [TechDocs Architecture](architecture.md) to get an overview of where these
providers are used.

| Source Code Hosting Provider | Support Status |
| ---------------------------- | -------------- |
| GitHub                       | Yes ✅         |
| GitHub Enterprise            | Yes ✅         |
| Bitbucket                    | Yes ✅         |
| Azure DevOps                 | Yes ✅         |
| GitLab                       | Yes ✅         |
| GitLab Enterprise            | Yes ✅         |

| File Storage Provider             | Support Status |
| --------------------------------- | -------------- |
| Local Filesystem of Backstage app | Yes ✅         |
| Google Cloud Storage (GCS)        | Yes ✅         |
| Amazon Web Services (AWS) S3      | Yes ✅         |
| Azure Blob Storage                | Yes ✅         |
| OpenStack Swift                   | Yes ✅         |

[Reach out to us](#feedback) if you want to request more platforms.

## Project roadmap

### **Ongoing work 🚧**

**Beta release** -
[Milestone](https://github.com/backstage/backstage/milestone/29)

- It should be possible and easy to use TechDocs in most environments across
  organizations.
- Minimal bugs, better error handling and scalable backend and frontend.
- Documentation Search
- TechDocs Homepage with basic features

### **Future work 🔮**

**General Availability (GA) release** -
[Milestone](https://github.com/backstage/backstage/milestone/30)

- Bugs are rare, TechDocs APIs are stable and scales easily in large
  organizations.
- Better integration with
  [Scaffolder V2](https://github.com/backstage/backstage/issues/2771) (e.g. easy
  to choose and plug documentation template with Software Templates).
- Possible to configure several aspects about TechDocs (e.g. URL, homepage,
  theme).

**Implement Feedback loop** -
[Milestone](https://github.com/backstage/backstage/milestone/31)

- A feedback loop between documentation reader and writer using TechDocs
- The `+` in `docs-like-code+` experience

**TechDocs widget framework**

Platformize TechDocs with a widget framework so that it is easy for TechDocs
contributors to add pieces of functionality and for users to choose which
functionalities they want to adopt. As a pre-requisite, the re-architecture of
TechDocs frontend [RFC](https://github.com/backstage/backstage/issues/3998)
needs to be addressed.

## Tech stack

| Stack                                           | Location                                                 |
| ----------------------------------------------- | -------------------------------------------------------- |
| Frontend Plugin                                 | [`@backstage/plugin-techdocs`][techdocs/frontend]        |
| Backend Plugin                                  | [`@backstage/plugin-techdocs-backend`][techdocs/backend] |
| CLI (for local development and generating docs) | [`@techdocs/cli`][techdocs/cli]                          |
| Docker Container (for generating docs)          | [`techdocs-container`][techdocs/container]               |

[techdocs/frontend]:
  https://github.com/backstage/backstage/blob/master/plugins/techdocs
[techdocs/backend]:
  https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend
[techdocs/container]: https://github.com/backstage/techdocs-container
[techdocs/cli]: https://github.com/backstage/techdocs-cli

## Contact us

Reach out to us in the `#docs-like-code` channel of our
[Discord chatroom](https://github.com/backstage/backstage#community).
