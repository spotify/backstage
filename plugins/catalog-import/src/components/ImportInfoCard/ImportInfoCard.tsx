/*
 * Copyright 2021 The Backstage Authors
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

import { ConfigApi, configApiRef, InfoCard, useApi } from '@backstage/core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { useImportOptions } from '../ImportOptionsContext';

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

export const ImportInfoCard = () => {
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const opts = useImportOptions();

  const repos = repositories(configApi);
  const repositoryString = repos.join(', ').replace(/, (\w*)$/, ' or $1');

  return (
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
      <Typography variant="h6">Link to an existing entity file</Typography>
      <Typography variant="subtitle2" color="textSecondary" paragraph>
        Example:{' '}
        <code>
          https://github.com/backstage/backstage/blob/master/catalog-info.yaml
        </code>
      </Typography>
      <Typography variant="body2" paragraph>
        The wizard analyzes the file, previews the entities, and adds them to
        the {appTitle} catalog.
      </Typography>
      {repos.length > 0 && (
        <>
          <Typography variant="h6">
            Link to a {repositoryString} repository
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" paragraph>
            Example: <code>https://github.com/backstage/backstage</code>
          </Typography>
          <Typography variant="body2" paragraph>
            The wizard discovers all <code>catalog-info.yaml</code> files in the
            repository, previews the entities, and adds them to the {appTitle}{' '}
            catalog.
          </Typography>
          {!opts?.pullRequest?.disable && (
            <Typography variant="body2" paragraph>
              If no entities are found, the wizard will prepare a Pull Request
              that adds an example <code>catalog-info.yaml</code> and prepares
              the {appTitle} catalog to load all entities as soon as the Pull
              Request is merged.
            </Typography>
          )}
        </>
      )}
    </InfoCard>
  );
};
