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

import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { ImportStepper } from './ImportStepper';
import { StepperProviderOpts } from './ImportStepper/defaults';

import { ConfigApi, configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  Content,
  ContentHeader,
  Header,
  InfoCard,
  Page,
  SupportButton,
} from '@backstage/core-components';

function repositories(configApi: ConfigApi): string[] {
  const integrations = configApi.getConfig('integrations');
  const repos = [];
  if (integrations.has('github')) {
    repos.push('GitHub');
  }
  if (integrations.has('bitbucket')) {
    repos.push('Bitbucket');
  }
  if (integrations.has('gitlab')) {
    repos.push('GitLab');
  }
  if (integrations.has('azure')) {
    repos.push('Azure');
  }
  return repos;
}

export const ImportComponentPage = (opts: StepperProviderOpts) => {
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';

  const repos = repositories(configApi);
  const repositoryString = repos.join(', ').replace(/, (\w*)$/, ' or $1');

  return (
    <Page themeId="home">
      <Header title="Register an existing component" />
      <Content>
        <ContentHeader title={`Start tracking your component in ${appTitle}`}>
          <SupportButton>
            Start tracking your component in {appTitle} by adding it to the
            software catalog.
          </SupportButton>
        </ContentHeader>

        <Grid container spacing={2} direction="row-reverse">
          <Grid item xs={12} md={4} lg={6} xl={8}>
            <InfoCard
              title="Register an existing component"
              deepLink={{
                title: 'Learn more about the Software Catalog',
                link:
                  'https://backstage.io/docs/features/software-catalog/software-catalog-overview',
              }}
            >
              <Typography variant="body2" paragraph>
                Enter the URL to your SCM repository to add it to {appTitle}.
              </Typography>
              <Typography variant="h6">
                Link to an existing entity file
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" paragraph>
                Example:{' '}
                <code>
                  https://github.com/backstage/backstage/blob/master/catalog-info.yaml
                </code>
              </Typography>
              <Typography variant="body2" paragraph>
                The wizard analyzes the file, previews the entities, and adds
                them to the {appTitle} catalog.
              </Typography>
              {repos.length > 0 && (
                <>
                  <Typography variant="h6">
                    Link to a {repositoryString} repository
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    paragraph
                  >
                    Example: <code>https://github.com/backstage/backstage</code>
                  </Typography>
                  <Typography variant="body2" paragraph>
                    The wizard discovers all <code>catalog-info.yaml</code>{' '}
                    files in the repository, previews the entities, and adds
                    them to the {appTitle} catalog.
                  </Typography>
                  {!opts?.pullRequest?.disable && (
                    <Typography variant="body2" paragraph>
                      If no entities are found, the wizard will prepare a Pull
                      Request that adds an example{' '}
                      <code>catalog-info.yaml</code> and prepares the {appTitle}{' '}
                      catalog to load all entities as soon as the Pull Request
                      is merged.
                    </Typography>
                  )}
                </>
              )}
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ImportStepper opts={opts} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
