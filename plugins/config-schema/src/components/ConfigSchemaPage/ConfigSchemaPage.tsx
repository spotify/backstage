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
import React, { useMemo } from 'react';
import { useObservable } from 'react-use';
import { configSchemaApiRef } from '../../api';
import { SchemaViewer } from '../SchemaViewer';
import { Typography } from '@material-ui/core';

import { Header, Page, Content, Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const ConfigSchemaPage = () => {
  const configSchemaApi = useApi(configSchemaApiRef);
  const schemaResult = useObservable(
    useMemo(() => configSchemaApi.schema$(), [configSchemaApi]),
  );

  let content;
  if (schemaResult) {
    if (schemaResult.schema) {
      content = <SchemaViewer schema={schemaResult.schema} />;
    } else {
      content = (
        <Typography variant="h4">No configuration schema available</Typography>
      );
    }
  } else {
    content = <Progress />;
  }

  return (
    <Page themeId="tool">
      <Header title="Configuration Reference" />
      <Content stretch>{content}</Content>
    </Page>
  );
};
