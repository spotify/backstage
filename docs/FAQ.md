---
id: FAQ
title: FAQ
description: All FAQ related to Backstage
---
## Product FAQ

### Can we call Backstage something different? So that it fits our company better?

Yes, Backstage is just a platform for building your own developer portal. We
happen to call our internal version Backstage, as well, as a reference to our
music roots. You can call your version whatever suits your team, company, or
brand.

### Is Backstage a monitoring platform?

No, but it can be! Backstage is designed to be a developer portal for all your
infrastructure tooling, services, and documentation. So, it's not a monitoring
platform — but that doesn't mean you can't integrate a monitoring tool into
Backstage by writing [a plugin](#what-is-a-plugin-in-backstage).

### How is Backstage licensed?

Backstage was released as open source software by Spotify and is licensed under
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

### Why did we open source Backstage?

We hope to see Backstage become the infrastructure standard everywhere. When we
saw how much Backstage improved developer experience and productivity
internally, we wanted to share those gains. After all, if Backstage can create
order in an engineering environment as open and diverse as ours, then we're
pretty sure it can create order (and boost productivity) anywhere. To learn
more, read our blog post,
"[What the heck is Backstage anyway?](https://backstage.io/blog/2020/03/18/what-is-backstage)"

### Will Spotify's internal plugins be open sourced, too?

Yes, we've already started releasing open source versions of some of the plugins
we use here, and we'll continue to do so.
[Plugins](#what-is-a-plugin-in-backstage) are the building blocks of
functionality in Backstage. We have over 120 plugins inside Spotify — many of
those are specialized for our use, so will remain internal and proprietary to
us. But we estimate that about a third of our existing plugins make good open
source candidates. (And we'll probably end up writing some brand new ones, too.)

### What's the roadmap for Backstage?

We envision three phases, which you can learn about in
[our project roadmap](overview/roadmap.md). Even though the open source version
of Backstage is relatively new compared to our internal version, we have already
begun work on various aspects of all three phases. Looking at the
[milestones for active issues](https://github.com/backstage/backstage/milestones)
will also give you a sense of our progress.

### My company doesn't have thousands of developers or services. Is Backstage overkill?

Not at all! A core reason to adopt Backstage is to standardize how software is
built at your company. It's easier to decide on those standards as a small
company, and grows in importance as the company grows. Backstage sets a
foundation, and an early investment in your infrastructure becomes even more
valuable as you grow.

### Our company has a strong design language system/brand that we want to incorporate. Does Backstage support this?

Yes! The Backstage UI is built using Material-UI. With the theming capabilities
of Material-UI, you are able to adapt the interface to your brand guidelines.

## Technical FAQ

### Why Material-UI?

The short answer is that's what we've been using in Backstage internally.

The original decision was based on Google's Material Design being a thorough,
well thought out and complete design system, with many mature and powerful
libraries implemented in both the system itself and auxiliary components that we
knew that we would like to use.

It strikes a good balance between power, customizability, and ease of use. A
core focus of Backstage is to make plugin developers productive with as few
hurdles as possible. Material-UI lets plugin makers get going easily with both
well-known tech and a large flora of components.

### What technology does Backstage use?

The codebase is a large-scale React application that uses TypeScript. For
[Phase 2](https://github.com/backstage/backstage#project-roadmap), we plan to
use Node.js and GraphQL.

### What is the end-to-end user flow? The happy path story.

There are three main user profiles for Backstage: the integrator, the
contributor, and the software engineer.

The **integrator** hosts the Backstage app and configures which plugins are
available to use in the app.

The **contributor** adds functionality to the app by writing plugins.

The **software engineer** uses the app's functionality and interacts with its
plugins.

### What is a "plugin" in Backstage?

Plugins are what provide the feature functionality in Backstage. They are used
to integrate different systems into Backstage's frontend, so that the developer
gets a consistent UX, no matter what tool or service is being accessed on the
other side.

Each plugin is treated as a self-contained web app and can include almost any
type of content. Plugins all use a common set of platform APIs and reusable UI
components. Plugins can fetch data either from the backend or an API exposed
through the proxy.

Learn more about [the different components](overview/what-is-backstage.md) that
make up Backstage.

### Why can't I dynamically install plugins without modifications the app?

This decision is part of the core architecture and development flow of
Backstage. Plugins have a lot of freedom in what they provide and how they are
integrated into the app, and it would therefore add a lot of complexity to allow
plugins to be integrated via configuration the same way as they can be
integrated with code.

By bundling all plugins and their dependencies into one app bundle it is also
possible to do significant optimizations to the app load time by allowing
plugins to share dependencies between each other when possible. This contributes
to Backstage being fast, which is an important part of the user and developer
experience.

### Why are there no published Docker images or helm charts for Backstage?

As mentioned above, Backstage is not a packaged service that you can use out of
the box. In order to get started with Backstage you need to use the
`@backstage/create-app` package to create and customize your own Backstage app.

In order to build a Docker image from your own app, you can use the
`yarn build-image` command which is included out of the box in the app template.
By default this image will bundle up both the frontend and the backend into a
single image that you can deploy using your favorite tooling.

There are also some examples that can help you deploy Backstage to kubernetes in
the
[contrib](https://github.com/backstage/backstage/tree/master/contrib/kubernetes)
folder.

It is possible that example images will be provided in the future, which can be
used to quickly try out a small subset of the functionality of Backstage, but
these would not be able to provide much more functionality on top of what you
can see on a demo site.

### Do I have to write plugins in TypeScript?

No, you can use JavaScript if you prefer. We want to keep the Backstage core
APIs in TypeScript, but aren't forcing it on individual plugins.

### How do I find out if a plugin already exists?

You can browse and search for all available plugins in the
[Plugin Marketplace](https://backstage.io/plugins).

If you can't find it in the marketplace, before you write a plugin
[search the plugin issues](https://github.com/backstage/backstage/issues?q=is%3Aissue+label%3Aplugin+)
to see if is in the works. If no one's thought of it yet, great! Open a new
issue as
[a plugin suggestion](https://github.com/backstage/backstage/issues/new/choose)
and describe what your plugin will do. This will help coordinate our
contributors' efforts and avoid duplicating existing functionality.

### Which plugin is used the most at Spotify?

By far, our most-used plugin is our TechDocs plugin, which we use for creating
technical documentation. Our philosophy at Spotify is to treat "docs like code",
where you write documentation using the same workflow as you write your code.
This makes it easier to create, find, and update documentation.
[TechDocs is now open source.](https://backstage.io/docs/features/techdocs/techdocs-overview)
(See also:
"[Will Spotify's internal plugins be open sourced, too?](#will-spotifys-internal-plugins-be-open-sourced-too)"
above)

### Are you planning to have plugins baked into the repo? Or should they be developed in separate repos?

Contributors can add open source plugins to the plugins directory in
[this monorepo](https://github.com/backstage/backstage). Integrators can then
configure which open source plugins are available to use in their instance of
the app. Open source plugins are downloaded as npm packages published in the
open source repository. While we encourage using the open source model, we know
there are cases where contributors might want to experiment internally or keep
their plugins closed source. Contributors writing closed source plugins should
develop them in the plugins directory in their own Backstage repository.
Integrators also configure closed source plugins locally from the monorepo.

### Any plans for integrating with other repository managers, such as GitLab or Bitbucket?

We chose GitHub because it is the tool that we are most familiar with, so that
will naturally lead to integrations for GitHub being developed at an early
stage. Hosting this project on GitHub does not exclude integrations with
alternatives, such as
[GitLab](https://github.com/backstage/backstage/issues?q=is%3Aissue+is%3Aopen+GitLab)
or Bitbucket. We believe that in time there will be plugins that will provide
functionality for these tools as well. Hopefully, contributed by the community!
Also note, implementations of Backstage can be hosted wherever you feel suits
your needs best.

### Who maintains Backstage?

Spotify will maintain the open source core, but we envision different parts of
the project being maintained by various companies and contributors. We also
envision a large, diverse ecosystem of open source plugins, which would be
maintained by their original authors/contributors or by the community. When it
comes to [deployment](https://backstage.io/docs/getting-started/deployment-k8s),
the system integrator (typically, the infrastructure team in your organization)
maintains Backstage in your own environment.

For more information, see our
[Owners](https://github.com/backstage/backstage/blob/master/OWNERS.md) and
[Governance](https://github.com/backstage/backstage/blob/master/GOVERNANCE.md).

### Does Spotify provide a managed version of Backstage?

No, this is not a service offering. We build the piece of software, and someone
in your infrastructure team is responsible for
[deploying](https://backstage.io/docs/getting-started/deployment-k8s) and
maintaining it.

### How secure is Backstage?

We take security seriously. When it comes to packages and code we scan our
repositories periodically and update our packages to the latest versions. When
it comes to deployment of Backstage within an organisation it depends on the
deployment and security setup in your organisation. Reach out to us on
[Discord](https://discord.gg/MUpMjP2) if you have specific queries.

Please report sensitive security issues via Spotify's
[bug-bounty program](https://hackerone.com/spotify) rather than GitHub.

### Does Backstage collect any information that is shared with Spotify?

No. Backstage does not collect any telemetry from any third party using the
platform. Spotify, and the open source community, do have access to
[GitHub Insights](https://github.com/features/insights), which contains
information such as contributors, commits, traffic, and dependencies. Backstage
is an open platform, but you are in control of your own data. You control who
has access to any data you provide to your version of Backstage and who that
data is shared with.

### Can Backstage be used to build something other than a developer portal?

Yes. The core frontend framework could be used for building any large-scale web
application where (1) multiple teams are building separate parts of the app, and
(2) you want the overall experience to be consistent. That being said, in
[Phase 2](overview/roadmap.md) of the project we will add features that are
needed for developer portals and systems for managing software ecosystems. Our
ambition will be to keep Backstage modular.

### How can I get involved?

Jump right in! Come help us fix some of the
[early bugs and good first issues](https://github.com/backstage/backstage/contribute)
or reach [a new milestone](https://github.com/backstage/backstage/milestones).
Or write an open source plugin for Backstage, like this
[Lighthouse plugin](https://github.com/backstage/backstage/tree/master/plugins/lighthouse).
See all the ways you can
[contribute here](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md).
We'd love to have you as part of the community.
