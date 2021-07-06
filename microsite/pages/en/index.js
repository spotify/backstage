/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const Block = Components.Block;
const ActionBlock = Components.ActionBlock;
const Breakpoint = Components.Breakpoint;
const BulletLine = Components.BulletLine;
const Banner = Components.Banner;

class Index extends React.Component {
  render() {
    const { config: siteConfig } = this.props;
    const { baseUrl } = siteConfig;

    return (
      <main className="MainContent">
        <Block small className="bg-black-grey stripe-bottom">
          <Block.Container>
            <Block.TextBox>
              <Block.Title main>
                An open platform for building developer portals
              </Block.Title>
              <Block.Paragraph>
                Powered by a centralized software catalog, Backstage restores
                order to your infrastructure and enables your product teams to
                ship high-quality code quickly — without compromising autonomy.
              </Block.Paragraph>
              <Block.LinkButton
                href={'https://github.com/backstage/backstage#getting-started'}
              >
                GitHub
              </Block.LinkButton>
            </Block.TextBox>
            <Block.Graphics>
              <Block.Graphic
                x={-12.5}
                y={16}
                width={120}
                src={`${baseUrl}img/laptop.svg`}
              />
              <Block.Graphic
                x={5.8}
                y={20}
                width={88}
                src={`${baseUrl}animations/backstage-logos-hero-8.gif`}
              />
            </Block.Graphics>
          </Block.Container>
        </Block>

        <Banner.Container>
          <Banner.Dismissable storageKey="k8s-launch">
            🎉 New feature: Kubernetes for service owners.{' '}
            <a href="https://backstage.io/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners">
              Learn more.
            </a>
          </Banner.Dismissable>
        </Banner.Container>

        <Block small className="stripe-top bg-black">
          <Block.Container wrapped>
            <Block.TextBox>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-speed-paradox-7.gif`}
              />
              <Block.SmallTitle small>The Speed Paradox</Block.SmallTitle>
              <Block.Paragraph>
                At Spotify, we’ve always believed in the speed and ingenuity
                that comes from having autonomous development teams. But as we
                learned firsthand, the faster you grow, the more fragmented and
                complex your software ecosystem becomes. And then everything
                slows down again.
              </Block.Paragraph>
            </Block.TextBox>
            <Block.TextBox>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-standards-paradox-4.gif`}
              />
              <Block.SmallTitle small>The Standards Paradox</Block.SmallTitle>
              <Block.Paragraph>
                By centralizing services and standardizing your tooling,
                Backstage streamlines your development environment from end to
                end. Instead of restricting autonomy, standardization frees your
                engineers from infrastructure complexity. So you can return to
                building and scaling, quickly and safely.
              </Block.Paragraph>
            </Block.TextBox>
          </Block.Container>
        </Block>

        <Block className="stripe-top bg-teal-top-right" wrapped>
          <Block.Container wrapped>
            <Block.TextBox wide>
              {' '}
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-software-catalog-icon-1.gif`}
              />
              <Block.Subtitle>
                Backstage Software Catalog{' '}
                <a
                  title="Submit feedback for this feature. Click to learn more about this release."
                  href="https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha"
                >
                  (alpha)
                </a>
              </Block.Subtitle>
              <Block.Title half>
                Build an ecosystem, not a wilderness
              </Block.Title>
            </Block.TextBox>
            <Breakpoint
              narrow={
                <Block.Graphics padding={5}>
                  <Block.Graphic
                    y={-8}
                    width={100}
                    src={`${baseUrl}img/components-with-filter-small.png`}
                  />
                </Block.Graphics>
              }
            />
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Manage all your software, all in one place{' '}
              </Block.SmallTitle>
              <Block.Paragraph>
                Backstage makes it easy for one team to manage 10 services — and
                makes it possible for your company to manage thousands of them
              </Block.Paragraph>
            </Block.TextBox>
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>A uniform overview</Block.SmallTitle>
              <Block.Paragraph>
                Every team can see all the services they own and related
                resources (deployments, data pipelines, pull request status,
                etc.)
              </Block.Paragraph>
            </Block.TextBox>
            <Block.Image
              wide
              style={{
                background: `url(${baseUrl}img/components-with-filter.png)`,
                backgroundSize: '594px 435.5px',
                width: '594px',
                height: '435.5px',
                margin: '-380px 105px 0 10px',
              }}
            />
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Metadata on tap</Block.SmallTitle>
              <Block.Paragraph>
                All that information can be shared with plugins inside Backstage
                to enable other management features, like resource monitoring
                and testing
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Not just services</Block.SmallTitle>
              <Block.Paragraph>
                Libraries, websites, ML models — you name it, Backstage knows
                all about it, including who owns it, dependencies, and more
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Discoverability & accountability
              </Block.SmallTitle>
              <Block.Paragraph>
                No more orphan software hiding in the dark corners of your tech
                stack
              </Block.Paragraph>
            </Block.TextBox>
            <Block.TextBox small></Block.TextBox>
          </Block.Container>
        </Block>

        <ActionBlock className="stripe bg-teal">
          <ActionBlock.Title>
            Learn more about the software catalog
          </ActionBlock.Title>
          <ActionBlock.Link
            href={`https://backstage.io/blog/2020/06/22/backstage-service-catalog-alpha`}
          >
            Read
          </ActionBlock.Link>
        </ActionBlock>

        <Block className="stripe-top bg-teal-bottom" wrapped>
          <Block.Container wrapped>
            <Block.TextBox wide>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-software-templates-icon-5.gif`}
              />
              <Block.Subtitle>
                Backstage Software Templates{' '}
                <a
                  title="Submit feedback for this feature. Click to learn more about this release."
                  href="https://backstage.io/blog/2020/08/05/announcing-backstage-software-templates"
                >
                  (alpha)
                </a>
              </Block.Subtitle>
              <Block.Title small>Standards can set you free</Block.Title>
            </Block.TextBox>
            <Breakpoint
              narrow={
                <Block.Graphics padding={20}>
                  <Block.Graphic
                    y={-38}
                    width={100}
                    src={`${baseUrl}img/service-cards.png`}
                  />
                </Block.Graphics>
              }
            />
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Like automated getting started guides
              </Block.SmallTitle>
              <Block.Paragraph>
                Using templates, engineers can spin up a new microservice with
                your organization’s best practices built-in, right from the
                start
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Push-button deployment</Block.SmallTitle>
              <Block.Paragraph>
                Click a button to create a Spring Boot project with your repo
                automatically configured on GitHub and your CI already running
                the first build
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Built to your standards</Block.SmallTitle>
              <Block.Paragraph>
                Go instead of Java? CircleCI instead of Jenkins? Serverless
                instead of Kubernetes? GCP instead of AWS? Customize your
                recipes with your best practices baked-in
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Golden Paths pave the way
              </Block.SmallTitle>
              <Block.Paragraph>
                When the right way is also the easiest way, engineers get up and
                running faster — and more safely
              </Block.Paragraph>
            </Block.TextBox>
            <Breakpoint
              wide={
                <Block.Graphics>
                  <Block.Graphic
                    x={-50}
                    y={-2}
                    width={200}
                    src={`${baseUrl}img/cards.png`}
                  />
                </Block.Graphics>
              }
            />
          </Block.Container>
        </Block>

        <ActionBlock className="stripe bg-teal">
          <ActionBlock.Title>
            Build your own software templates
          </ActionBlock.Title>
          <ActionBlock.Link
            href={`https://github.com/backstage/backstage/blob/master/docs/features/software-templates/index.md`}
          >
            Contribute
          </ActionBlock.Link>
        </ActionBlock>

        <Block className="stripe-top bg-teal-bottom" wrapped>
          <Block.Container wrapped>
            <Block.TextBox wide>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-techdocs-icon-1.gif`}
              />

              <Block.Subtitle>Backstage TechDocs</Block.Subtitle>
              <Block.Title small>Docs like code</Block.Title>
            </Block.TextBox>
            <Breakpoint
              narrow={
                <React.Fragment>
                  <Block.Graphics padding={26}>
                    <Block.Graphic
                      x={-1.4}
                      y={-45}
                      width={107}
                      src={`${baseUrl}img/techdocs-static-mobile.png`}
                    />
                  </Block.Graphics>
                </React.Fragment>
              }
            />
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Free documentation</Block.SmallTitle>
              <Block.Paragraph>
                Whenever you use a Backstage Software Template, your project
                automatically gets a TechDocs site, for free
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Easy to write</Block.SmallTitle>
              <Block.Paragraph>
                With our docs-like-code approach, engineers write their
                documentation in Markdown files right alongside their code
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Easy to maintain</Block.SmallTitle>
              <Block.Paragraph>
                Updating code? Update your documentation while you’re there —
                with docs and code in the same place, it becomes a natural part
                of your workstream
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Easy to find and use</Block.SmallTitle>
              <Block.Paragraph>
                Since all your documentation is in Backstage, finding any
                TechDoc is just a search query away
              </Block.Paragraph>
            </Block.TextBox>
            <Breakpoint
              wide={
                <Block.Graphics padding={0}>
                  <Block.Graphic
                    x={-55}
                    y={-5}
                    width={210}
                    src={`${baseUrl}img/techdocs-web.png`}
                  />
                  <Block.Graphic
                    x={-55}
                    y={-5}
                    width={210}
                    src={`${baseUrl}img/techdocs2.gif`}
                  />
                </Block.Graphics>
              }
            />
          </Block.Container>
        </Block>

        <ActionBlock className="stripe bg-teal">
          <ActionBlock.Title>Learn more about TechDocs</ActionBlock.Title>
          <ActionBlock.Link
            href={`https://backstage.io/docs/features/techdocs/techdocs-overview`}
          >
            Docs
          </ActionBlock.Link>
        </ActionBlock>

        <Block className="stripe-top bg-teal-bottom" wrapped>
          <Block.Container wrapped>
            <Block.TextBox wide>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-kubernetes-icon-1.gif`}
              />

              <Block.Subtitle>Backstage Kubernetes</Block.Subtitle>
              <Block.Title small>
                Manage your services, not clusters
              </Block.Title>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Kubernetes made just for service owners
              </Block.SmallTitle>
              <Block.Paragraph>
                Backstage features the first Kubernetes monitoring tool designed
                around the needs of service owners, not cluster admins
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Your service at a glance
              </Block.SmallTitle>
              <Block.Paragraph>
                Get all your service's deployments in one, aggregated view — no
                more digging through cluster logs in a CLI, no more combing
                through lists of services you don't own
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Pick a cloud, any cloud</Block.SmallTitle>
              <Block.Paragraph>
                Since Backstage uses the Kubernetes API, it's cloud agnostic —
                so it works no matter which cloud provider or managed Kubernetes
                service you use, and even works in multi-cloud orgs
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Any K8s, one UI</Block.SmallTitle>
              <Block.Paragraph>
                Now you don't have to switch dashboards when you move from local
                testing to production, or from one cloud provider to another
              </Block.Paragraph>
            </Block.TextBox>
          </Block.Container>
        </Block>
        <ActionBlock className="stripe bg-teal">
          <ActionBlock.Title>Learn more about the K8s plugin</ActionBlock.Title>
          <ActionBlock.Link
            href={`https://backstage.io/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners`}
          >
            Read
          </ActionBlock.Link>
        </ActionBlock>

        <Block className="stripe-top bg-teal-bottom" wrapped>
          <Block.Container wrapped>
            <Block.TextBox wide>
              <img
                className="Block__GIF"
                src={`${baseUrl}animations/backstage-plugin-icon-2.gif`}
              />

              <Block.Subtitle>Customize Backstage with plugins</Block.Subtitle>
              <Block.Title small>
                An app store for your infrastructure
              </Block.Title>
            </Block.TextBox>
            <Breakpoint
              narrow={
                <Block.Graphics padding={10}>
                  <Block.Graphic
                    y={-20}
                    width={100}
                    src={`${baseUrl}img/plugins.png`}
                  />
                </Block.Graphics>
              }
            />
            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>Add functionality</Block.SmallTitle>
              <Block.Paragraph>
                Want scalable website testing? Add the{' '}
                <a href="https://backstage.io/blog/2020/04/06/lighthouse-plugin">
                  Lighthouse
                </a>{' '}
                plugin. Wondering about recommended frameworks? Add the{' '}
                <a href="https://backstage.io/blog/2020/05/14/tech-radar-plugin">
                  Tech Radar
                </a>{' '}
                plugin.{' '}
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>BYO Plugins</Block.SmallTitle>
              <Block.Paragraph>
                If you don’t see the plugin you need, it’s simple to build your
                own
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Integrate your own custom tooling
              </Block.SmallTitle>
              <Block.Paragraph>
                Building internal plugins lets you tailor your version of
                Backstage to be a perfect fit for your infrastructure
              </Block.Paragraph>
            </Block.TextBox>

            <Block.TextBox small>
              <BulletLine />
              <Block.SmallTitle small>
                Share with the community
              </Block.SmallTitle>
              <Block.Paragraph>
                Building <a href="/plugins">open source plugins</a> contributes
                to the entire Backstage ecosystem, which benefits everyone
              </Block.Paragraph>
            </Block.TextBox>

            <Breakpoint
              wide={<img src={`${baseUrl}img/cards-plugins.png`} />}
            />
          </Block.Container>
        </Block>

        <ActionBlock className="stripe-top bg-teal">
          <ActionBlock.Title>Build a plugin</ActionBlock.Title>
          <ActionBlock.Link href="/docs/plugins/create-a-plugin">
            Contribute
          </ActionBlock.Link>
        </ActionBlock>

        <Block small className="bg-black-grey cncf-block">
          <Block.Container center>
            <Block.SmallTitle small>
              Backstage is a{' '}
              <a href="https://www.cncf.io">
                Cloud Native Computing Foundation
              </a>{' '}
              sandbox project
              <div className="cncf-logo" />
            </Block.SmallTitle>
          </Block.Container>
        </Block>
      </main>
    );
  }
}

module.exports = Index;
