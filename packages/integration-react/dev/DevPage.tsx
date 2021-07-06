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

import { ScmIntegration, ScmIntegrationsGroup } from '@backstage/integration';
import { Typography } from '@material-ui/core';
import React from 'react';
import { scmIntegrationsApiRef } from '../src/ScmIntegrationsApi';

import { Content } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const Integrations = (props: {
  group: ScmIntegrationsGroup<ScmIntegration>;
}) => {
  const integrations = props.group.list();
  if (!integrations) {
    return (
      <Typography color="textSecondary">
        No integrations of this type
      </Typography>
    );
  }

  return (
    <Typography variant="caption">
      <pre>{JSON.stringify(integrations, undefined, 2)}</pre>
    </Typography>
  );
};

export const DevPage = () => {
  const integrations = useApi(scmIntegrationsApiRef);
  return (
    <Content>
      <Typography paragraph variant="h2">
        Azure
      </Typography>
      <Integrations group={integrations.azure} />
      <Typography paragraph variant="h2">
        Bitbucket
      </Typography>
      <Integrations group={integrations.bitbucket} />
      <Typography paragraph variant="h2">
        GitHub
      </Typography>
      <Integrations group={integrations.github} />
      <Typography paragraph variant="h2">
        GitLab
      </Typography>
      <Integrations group={integrations.gitlab} />
    </Content>
  );
};
