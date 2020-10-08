/*
 * Copyright 2020 Spotify AB
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

import { Content, ContentHeader, SupportButton, useApi } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { Button } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';
import { SquadExplorerTable } from '../SquadExplorerTable';
import { SquadExplorerLayout } from './SquadExplorerLayout';

export const SquadExplorerPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: matchingEntities } = useAsync(() => {
    return catalogApi.getEntities({ kind: 'group' });
  }, [catalogApi]);

  return (
    <SquadExplorerLayout>
      <Content>
        <ContentHeader title="">
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register-component"
          >
            Register Existing Squad
          </Button>
          <SupportButton>All your Squads</SupportButton>
        </ContentHeader>
        <SquadExplorerTable
          titlePreamble="Squads"
          entities={matchingEntities!}
          loading={loading}
          error={error}
        />
      </Content>
    </SquadExplorerLayout>
  );
};
