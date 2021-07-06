/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Components = require(`${process.cwd()}/core/Components.js`);
const Block = Components.Block;

const Background = props => {
  const { config: siteConfig } = props;
  const { baseUrl } = siteConfig;
  return (
    <main className="MainContent">
      <Block small className="stripe-bottom bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>See us in action</Block.Title>
            <Block.Paragraph>
              Watch the videos below to get an introduction to Backstage and to
              see how we use different plugins to customize{' '}
              <a href="https://engineering.atspotify.com/2020/04/21/how-we-use-backstage-at-spotify/">
                our internal version of Backstage at Spotify
              </a>
              .
            </Block.Paragraph>
            <Block.Paragraph>
              To see how other companies have already started using Backstage,
              watch these presentations from{' '}
              <a href="https://youtu.be/rRphwXeq33Q?t=1508">Expedia</a>,{' '}
              <a href="https://youtu.be/6sg5uMCLxTA?t=153">Zalando</a>, and{' '}
              <a href="https://youtu.be/UZTVjv-AvZA?t=188">TELUS</a>. For more,
              join our{' '}
              <a href="https://github.com/backstage/community">
                Community Sessions
              </a>
              .
            </Block.Paragraph>
            <Block.Paragraph>
              To explore the UI and basic features of Backstage firsthand, go
              to: <a href="https://demo.backstage.io">demo.backstage.io</a>.
              (Tip: click “All” to view all the example components in the
              software catalog.)
            </Block.Paragraph>
          </Block.TextBox>
          <Block.Graphics>
            <Block.Graphic
              x={-7}
              y={-12}
              width={120}
              src={`${baseUrl}img/demo-screen.png`}
            />
          </Block.Graphics>
        </Block.Container>
      </Block>

      <Block small className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Introduction to Backstage</Block.Title>
            <Block.Paragraph>
              Backstage is an open source platform for building developer
              portals. We’ve been using our homegrown version at Spotify for
              years — so it’s already packed with features. (We have over 120
              internal plugins, built by 60 different teams.) In this live demo
              recording, Stefan Ålund, product manager for Backstage, tells the
              origin story of Backstage and gives you a tour of how we use it
              here at Spotify.
            </Block.Paragraph>
            <Block.LinkButton
              href={'https://www.youtube.com/watch?v=1XtJ5FAOjPk'}
            >
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/1XtJ5FAOjPk"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Control cloud costs</Block.Title>
            <Block.Paragraph>
              How do you control cloud costs while maintaining the speed and
              independence of your development teams? With the{' '}
              <a href="https://backstage.io/plugins">Cost Insights plugin</a>{' '}
              for Backstage, managing cloud costs becomes just another part of
              an engineer’s daily development process. They get a clear view of
              their spending — and can decide for themselves how they want to
              optimize it. Learn more about the{' '}
              <a href="https://backstage.io/blog/2020/10/22/cost-insights-plugin">
                Cost Insights plugin
              </a>
              .
            </Block.Paragraph>
            <Block.LinkButton href="https://youtu.be/YLAd5hdXR_Q">
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/YLAd5hdXR_Q"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title id="techdocs-demo">
              Make documentation easy
            </Block.Title>
            <Block.Paragraph>
              Documentation! Everyone needs it, no one wants to create it, and
              no one can ever find it. Backstage follows a “docs like code”
              approach: you write documentation in Markdown files right
              alongside your code. This makes documentation easier to create,
              maintain, find — and, you know, actually use. This demo video
              showcases Spotify’s internal version of TechDocs. Learn more about{' '}
              <a href="https://backstage.io/blog/2020/09/08/announcing-tech-docs">
                TechDocs
              </a>
              .
            </Block.Paragraph>
            <Block.LinkButton href="https://youtu.be/mOLCgdPw1iA">
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/mOLCgdPw1iA"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block small className="bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Manage your tech health</Block.Title>
            <Block.Paragraph>
              Instead of manually updating a spreadsheet, what if you had a
              beautiful dashboard that could give you an instant, interactive
              picture of your entire org’s tech stack? That’s how we do it at
              Spotify. With our Tech Insights plugin for Backstage, anyone at
              Spotify can see which version of which software anyone else at
              Spotify is using — and a whole a lot more. From managing
              migrations to fighting tech entropy, Backstage makes managing our
              tech health actually kind of pleasant.
            </Block.Paragraph>

            <Block.LinkButton
              href={
                'https://www.youtube.com/watch?v=K3xz6VAbgH8&list=PLf1KFlSkDLIBtMGwRDfaVlKMqTMrjD2yO&index=6'
              }
            >
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/K3xz6VAbgH8"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block small className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Create a microservice</Block.Title>
            <Block.Paragraph>
              You’re a Spotify engineer about to build a new microservice (or
              any component) using Spring Boot. Where do you start? Search for a
              quick start guide online? Create an empty repo on GitHub? Copy and
              paste an old project? Nope. Just go to Backstage, and you’ll be up
              and running in two minutes — with a “Hello World” app, CI, and
              documentation all automatically set up and configured in a
              standardized way.
            </Block.Paragraph>

            <Block.LinkButton
              href={'https://www.youtube.com/watch?v=U1iwe3L5pzc'}
            >
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/U1iwe3L5pzc"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block small className="bg-black-grey">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Search all your services</Block.Title>
            <Block.Paragraph>
              All of Spotify’s services are automatically indexed in Backstage.
              So our engineers can stop playing detective — no more spamming
              Slack channels asking if anyone knows who owns a particular
              service and where you can find its API, only to discover that the
              owner went on sabbatical three months ago and you have to hunt
              them down on a mountain in Tibet where they’re on a 12-day silent
              meditation retreat. At Spotify, anyone can always find anyone
              else’s service, inspect its APIs, and contact its current owner —
              all with one search.
            </Block.Paragraph>
            <Block.LinkButton
              href={'https://www.youtube.com/watch?v=vcDL9tOv7Eo'}
            >
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/vcDL9tOv7Eo"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>

      <Block className="stripe bg-black">
        <Block.Container style={{ justifyContent: 'flex-start' }}>
          <Block.TextBox>
            <Block.Title>Manage data pipelines</Block.Title>
            <Block.Paragraph>
              We manage a lot of data pipelines (also known as workflows) here
              at Spotify. So, of course, we made a great workflows plugin for
              our version of Backstage. All our workflow tools — including a
              scheduler, log inspector, data lineage graph, and configurable
              alerts — are integrated into one simple interface.
            </Block.Paragraph>
            <Block.LinkButton
              href={'https://www.youtube.com/watch?v=rH46MLNZIPM '}
            >
              Watch now
            </Block.LinkButton>
          </Block.TextBox>
          <Block.MediaFrame>
            <iframe
              width="800"
              height="500"
              src="https://www.youtube.com/embed/rH46MLNZIPM"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Block.MediaFrame>
        </Block.Container>
      </Block>
    </main>
  );
};

module.exports = Background;
