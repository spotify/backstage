---
id: roadmap
title: Project roadmap
description: Roadmap of Backstage Project
---

## Current status

> Backstage is currently under rapid development. This means that you can expect
> APIs and features to evolve. It is also recommended that teams who adopt
> Backstage today [upgrade their installation](../cli/commands.md#versionsbump)
> as new [releases](https://github.com/backstage/backstage/releases) become
> available, as Backwards compatibility is not yet guaranteed.

## Phases

We have divided the project into three high-level _phases_:

- 🐣 **Phase 1:** Extensible frontend platform (Done ✅) - You will be able to
  easily create a single consistent UI layer for your internal infrastructure
  and tools. A set of reusable
  [UX patterns and components](https://backstage.io/storybook) help ensure a
  consistent experience between tools.

- 🐢 **Phase 2:** Software Catalog
  ([alpha released](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)) -
  With a single catalog, Backstage makes it easy for a team to manage ten
  services — and makes it possible for your company to manage thousands of them.

- 🐇 **Phase 3:** Ecosystem (ongoing, see
  [Plugin Marketplace](https://backstage.io/plugins)) - Everyone's
  infrastructure stack is different. By fostering a vibrant community of
  contributors we hope to provide an ecosystem of Open Source
  plugins/integrations that allows you to pick the tools that match your stack.

## Detailed roadmap

If you have questions about the roadmap or want to provide feedback, we would
love to hear from you! Please create an
[Issue](https://github.com/backstage/backstage/issues/new/choose), ping us on
[Discord](https://discord.gg/EBHEGzX) or reach out directly at
[backstage-interest@spotify.com](mailto:backstage-interest@spotify.com).

Want to help out? Awesome ❤️ Head over to
[CONTRIBUTING](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)
guidelines to get started.

### Ongoing work 🚧

- **[Platform stabilization](https://github.com/backstage/backstage/milestone/19)** -
  Stabilize the core of Backstage, including its core features, so that the
  platform can be depended on for production use. After this, plugins will
  require little-to-no maintenance.

- **[Kubernetes plugin for service owners](https://github.com/backstage/backstage/issues/2857)** -
  Improve native support for Kubernetes, making it easier for service owners to
  see and manage their services running in K8s, regardless if that's locally, in
  AWS, GCS, Azure, or elsewhere.

- **[Search platform](../features/search/README.md)** - Evolve the basic search
  functionality currently available into a platform that **a)** enables search
  across the software catalog, TechDocs, and any other information exposed by
  plugins, and **b)** supports a variety of search engine technologies.

- **[Software Templates V2](https://github.com/backstage/backstage/issues/2771)** -
  Expand the templates to make the steps more composable by adding the ability
  to add more steps for custom logic, including webhooks and using authorization
  from integrations.

### Future work 🔮

- **Golden Path for Plugin Development** - Create an easy, standardized way for
  developers to build plugins that will encourage contributions and lead to a
  richer ecosystem for everyone.

- **[GraphQL API](https://github.com/backstage/backstage/milestone/13)** - A
  GraphQL API will open up the rich metadata provided by Backstage in a single
  query. Plugins can easily query this API as well as extend the model where
  needed.

- **Inter-Plugin Communication** - **[Under consideration]** Establish more
  clearly defined patterns for plugins to communicate.

- **Improved Access Control** - **[Under consideration]** Provide finer grained
  access controls and management for better control of the platform user
  experience.

### Plugins

Building and maintaining [plugins](https://backstage.io/plugins) is the work of
the entire Backstage community.

A list of plugins that are in development is
[available here](https://github.com/backstage/backstage/issues?q=is%3Aissue+is%3Aopen+label%3Aplugin+sort%3Areactions-%2B1-desc).
We strongly recommend to upvote 👍 plugins you are interested in. This helps us
and the community prioritize what plugins to build.

Are you missing a plugin for your favorite tool? Please
[suggest a new one](https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME).
Chances are that someone will jump in and help build it.

### Community Initiatives 🧑‍🤝‍🧑

- [**Backstage Community Sessions**](https://github.com/backstage/community#meetups) -
  A monthly meetup for the community to come together to share and learn about
  the latest happenings in Backstage.

- **Backstage Hackathons** - (Coming soon) Open to everyone in our Backstage
  community, a celebration of you, the project and building awesome things
  together

### Completed milestones ✅

- [Deploy a product demo at `demo.backstage.io`](https://demo.backstage.io)
- [Kubernetes plugin - v1](https://github.com/backstage/backstage/tree/master/plugins/kubernetes)
- [Helm charts](https://github.com/backstage/backstage/tree/master/contrib/chart/backstage)
- [Backstage Design System 💅](https://backstage.io/blog/2020/09/30/backstage-design-system)
- [Cost Insights plugin 💸](https://engineering.atspotify.com/2020/09/29/managing-clouds-from-the-ground-up-cost-engineering-at-spotify/)
- [Donate Backstage to the CNCF 🎉](https://backstage.io/blog/2020/09/23/backstage-cncf-sandbox)
- [TechDocs v1](https://backstage.io/blog/2020/09/08/announcing-tech-docs)
- [Plugin marketplace](https://backstage.io/plugins)
- [Improved and move documentation to backstage.io](https://backstage.io/docs/overview/what-is-backstage)
- [Backstage Software Catalog (alpha)](https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha)
- [Backstage Software Templates (alpha)](https://backstage.io/blog/2020/08/05/announcing-backstage-software-templates)
- [Make it possible to add custom auth providers](https://backstage.io/blog/2020/07/01/how-to-enable-authentication-in-backstage-using-passport)
- [TechDocs v0](https://github.com/backstage/backstage/milestone/15)
- CI plugins: CircleCI, Jenkins, GitHub Actions and TravisCI
- [Service API documentation](https://github.com/backstage/backstage/pull/1737)
- Backstage Software Catalog can read from: GitHub, GitLab,
  [Bitbucket](https://github.com/backstage/backstage/pull/1938)
- Support auth providers: Google, Okta, GitHub, GitLab,
  [auth0](https://github.com/backstage/backstage/pull/1611),
  [AWS](https://github.com/backstage/backstage/pull/1990)
