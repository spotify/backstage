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

import {
  configApiRef,
  Content,
  ContentHeader,
  Header,
  Page,
  SupportButton,
  useApi,
} from '@backstage/core';
import { Grid } from '@material-ui/core';
import React from 'react';
import { ImportInfoCard } from '../ImportInfoCard';
import { ImportStepper } from '../ImportStepper';

export const DefaultImportComponentPage = () => {
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptional('app.title') || 'Backstage';

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
            <ImportInfoCard />
          </Grid>

          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ImportStepper />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
