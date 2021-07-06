/*
 * Copyright 2020 Backstage Project Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div className="footer-title">
            <a href={this.props.config.baseUrl}>
              <h2 className="footerLogo"></h2>
            </a>
          </div>
          <div>
            <h5>Docs</h5>
            <a href={`/docs/overview/what-is-backstage`}>What is Backstage?</a>
            <a href={`/docs/getting-started/`}>Getting started</a>
            <a
              href={`/docs/features/software-catalog/software-catalog-overview`}
            >
              Software Catalog
            </a>
            <a href={`/docs/plugins/create-a-plugin`}>Create a Plugin</a>
            <a href={`/docs/dls/design`}>Designing for Backstage</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://discord.gg/MUpMjP2">Support chatroom</a>
            <a href="https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md">
              Contributing
            </a>
            <a href="https://mailchi.mp/spotify/backstage-community">
              Subscribe to our newsletter
            </a>
            <a href="https://www.cncf.io/sandbox-projects/">CNCF Sandbox</a>
          </div>
          <div>
            <h5>More</h5>
            <a href={this.props.config.fossWebsite}>
              Open Source @ {this.props.config.organizationName}
            </a>

            <a href="https://engineering.atspotify.com/">
              Spotify Engineering Blog
            </a>
            <a href="https://developer.spotify.com/">Spotify for Developers</a>

            <a href={this.props.config.repoUrl}>GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/backstage/backstage/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
            {this.props.config.twitterUsername && (
              <div className="social">
                <a
                  href={`https://twitter.com/${this.props.config.twitterUsername}`}
                  className="twitter-follow-button"
                >
                  Follow @{this.props.config.twitterUsername}
                </a>
              </div>
            )}
          </div>
        </section>
        <p style={{ textAlign: 'center' }}>
          <a href="https://spotify.github.io">Made with ❤️&nbsp;at Spotify</a>
        </p>
        <p className="copyright">{this.props.config.copyright}</p>
      </footer>
    );
  }
}

module.exports = Footer;
