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

import React from 'react';

import { Header, Page } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

type Props = {
  children?: React.ReactNode;
};

export const TechDocsHomeLayout = ({ children }: Props) => {
  const configApi = useApi(configApiRef);
  const generatedSubtitle = `Documentation available in ${
    configApi.getOptionalString('organization.name') ?? 'Backstage'
  }`;

  return (
    <Page themeId="documentation">
      <Header title="Documentation" subtitle={generatedSubtitle} />
      {children}
    </Page>
  );
};
