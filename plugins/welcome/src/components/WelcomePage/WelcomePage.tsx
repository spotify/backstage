/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@material-ui/core';

import {
  Content,
  InfoCard,
  Header,
  HomepageTimer,
  Page,
  ContentHeader,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';

import { useApi, configApiRef } from '@backstage/core-plugin-api';

const WelcomePage = () => {
  const appTitle =
    useApi(configApiRef).getOptionalString('app.title') ?? 'Backstage';
  const profile = { givenName: '' };

  return (
    <Page themeId="home">
      <Header
        title={`Welcome ${profile.givenName || `to ${appTitle}`}`}
        subtitle="Let's start building a better developer experience"
      >
        <HomepageTimer />
      </Header>
      <Content>
        <ContentHeader title="Getting Started">
          <SupportButton />
        </ContentHeader>

        <Grid container>
          <Grid item xs={12}>
            <WarningPanel
              title="Backstage is in early development"
              message={
                <>
                  We created Backstage about 4 years ago. While Spotify's
                  internal version of Backstage has had the benefit of time to
                  mature and evolve, the first iteration of our open source
                  version is still nascent. We are envisioning three phases of
                  the project and we have already begun work on various aspects
                  of these phases. The best way to keep track of the progress is
                  through the&nbsp;
                  <Link
                    href="https://github.com/backstage/backstage/milestones"
                    rel="noopener noreferrer"
                  >
                    Milestones
                  </Link>
                  .
                </>
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard title="What Now?">
              <Typography variant="body1" gutterBottom>
                You now have a running instance of Backstage!&nbsp;
                <span role="img" aria-label="confetti">
                  🎉
                </span>
                &nbsp;Let's make sure you get the most out of this platform by
                walking you through the basics.
              </Typography>
              <Typography variant="h6" gutterBottom>
                The Setup
              </Typography>
              <Typography variant="body1" paragraph>
                Backstage is put together from three base concepts: the core,
                the app and the plugins.
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="The core is responsible for base functionality." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="The app provides the base UI and connects the plugins." />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="The plugins make Backstage useful for the end users with
                  specific views and functionality."
                  />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom>
                Build Your Plugins
              </Typography>
              <Typography variant="body1" paragraph>
                We suggest you either check out the documentation for{' '}
                <Link
                  href="https://github.com/backstage/backstage/blob/master/docs/plugins/create-a-plugin.md"
                  rel="noopener noreferrer"
                >
                  creating a plugin
                </Link>{' '}
                or have a look in the code for the{' '}
                <Link component={RouterLink} to="/explore">
                  existing plugins
                </Link>{' '}
                in the directory{' '}
                <Link
                  href="https://github.com/backstage/backstage/tree/master/plugins"
                  rel="noopener noreferrer"
                >
                  <code>plugins/</code>
                </Link>
                .
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <InfoCard title="Quick Links">
              <List>
                <ListItem>
                  <Link href="https://backstage.io">backstage.io</Link>
                </ListItem>
                <ListItem>
                  <Link
                    href="https://github.com/backstage/backstage/blob/master/docs/plugins/create-a-plugin.md"
                    rel="noopener noreferrer"
                  >
                    Create a plugin
                  </Link>
                </ListItem>
                <ListItem>
                  <Link href="/explore">Plugin gallery</Link>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default WelcomePage;
