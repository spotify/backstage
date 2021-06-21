/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// const fs = require('fs');
const yaml = require('js-yaml');
const React = require('react');
const Components = props => <div {...props}></div>;
import Layout from "@theme/Layout";
const {
  Block: { Container },
  BulletLine,
} = Components;

// const pluginsDirectory = require('path').join(process.cwd(), 'data/plugins');
// const pluginMetadata = fs
//   .readdirSync(pluginsDirectory)
//   .map(file => yaml.load(fs.readFileSync(`./data/plugins/${file}`, 'utf8')))
//   .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
// const truncate = text =>
//   text.length > 170 ? text.substr(0, 170) + '...' : text;

const pluginMetadata = [];

const addPluginDocsLink = '/docs/plugins/add-to-marketplace';
const defaultIconUrl = 'img/logo-gradient-on-dark.svg';

const Plugins = () => (
  <main className="MainContent">
    <div className="PluginPageLayout">
      <div className="PluginPageHeader">
        <h2>Plugin Marketplace</h2>
        <p>
          Open source plugins that you can add to your Backstage deployment.
          Learn how to build a <a href="/docs/plugins">plugin</a>.
        </p>
        <span>
          <a
            className="PluginAddNewButton ButtonFilled"
            href={addPluginDocsLink}
          >
            <b>Add to Marketplace</b>
          </a>
        </span>
      </div>
      <BulletLine style={{ width: '100% ' }} />
      <div className="PluginPageHeader">
        <h2>Core Features</h2>
      </div>
      <Container wrapped className="PluginGrid">
        {pluginMetadata
          .filter(plugin => plugin.category === 'Core Feature')
          .sort((a, b) => a.order - b.order)
          .map(
            ({
              iconUrl,
              title,
              description,
              author,
              authorUrl,
              documentation,
              category,
            }) => (
              <div className="PluginCard">
                <div className="PluginCardHeader">
                  <div className="PluginCardImage">
                    <img src={iconUrl || defaultIconUrl} alt={title} />
                  </div>
                  <div className="PluginCardInfo">
                    <h3 className="PluginCardTitle">{title}</h3>
                    <p className="PluginCardAuthor">
                      by <a href={authorUrl}>{author}</a>
                    </p>
                    <span className="PluginCardChipOutlined">{category}</span>
                  </div>
                </div>
                <div className="PluginCardBody">
                  <p>{truncate(description)}</p>
                </div>
                <div className="PluginCardFooter">
                  <a className="ButtonFilled" href={documentation}>
                    Explore
                  </a>
                </div>
              </div>
            ),
          )}
      </Container>
      <div className="PluginPageHeader">
        <h2>All Plugins</h2>
      </div>
      <Container wrapped className="PluginGrid">
        {pluginMetadata
          .filter(plugin => plugin.category !== 'Core Feature')
          .map(
            ({
              iconUrl,
              title,
              description,
              author,
              authorUrl,
              documentation,
              category,
            }) => (
              <div className="PluginCard">
                <div className="PluginCardHeader">
                  <div className="PluginCardImage">
                    <img src={iconUrl || defaultIconUrl} alt={title} />
                  </div>
                  <div className="PluginCardInfo">
                    <h3 className="PluginCardTitle">{title}</h3>
                    <p className="PluginCardAuthor">
                      by <a href={authorUrl}>{author}</a>
                    </p>
                    <span className="PluginCardChipOutlined">{category}</span>
                  </div>
                </div>
                <div className="PluginCardBody">
                  <p>{truncate(description)}</p>
                </div>
                <div className="PluginCardFooter">
                  <a className="ButtonFilled" href={documentation}>
                    Explore
                  </a>
                </div>
              </div>
            ),
          )}
        <div className="PluginCard" id="add-plugin-card">
          <div className="PluginCardBody">
            <p>
              Do you have an existing plugin that you want to add to the
              Marketplace?
            </p>
            <p
              style={{
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              <a className="ButtonFilled" href={addPluginDocsLink}>
                <b>Add to Marketplace</b>
              </a>
            </p>
          </div>
          <Container className="PluginCardFooter">
            <p>
              See what plugins are already
              <a href="https://github.com/backstage/backstage/issues?q=is%3Aissue+is%3Aopen+label%3Aplugin+sort%3Areactions-%2B1-desc">
                in progress
              </a>
              and 👍. Missing a plugin for your favorite tool? Please
              <a href="https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME">
                suggest
              </a>
              a new one.
            </p>
          </Container>
        </div>
      </Container>
    </div>
  </main>
);

export default props => <Layout><Plugins {...props} /></Layout>;
