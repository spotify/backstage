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
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import 'graphiql/graphiql.css';
import { graphQlBrowseApiRef } from '../../lib/api';
import { GraphiQLBrowser } from '../GraphiQLBrowser';
import { Typography } from '@material-ui/core';
import {
  Content,
  Header,
  HeaderLabel,
  Page,
  Progress,
} from '@backstage/core-components';

export const GraphiQLPage = () => {
  const graphQlBrowseApi = useApi(graphQlBrowseApiRef);
  const endpoints = useAsync(() => graphQlBrowseApi.getEndpoints());

  let content: JSX.Element;

  if (endpoints.loading) {
    content = (
      <Content>
        <Progress />
      </Content>
    );
  } else if (endpoints.error) {
    content = (
      <Content>
        <Typography variant="h4" color="error">
          {/* TODO: provide a proper error component */}
          Failed to load GraphQL endpoints, {String(endpoints.error)}
        </Typography>
      </Content>
    );
  } else {
    content = (
      <Content noPadding>
        <GraphiQLBrowser endpoints={endpoints.value!} />
      </Content>
    );
  }

  return (
    <Page themeId="tool">
      <Header title="GraphiQL">
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      {content}
    </Page>
  );
};
