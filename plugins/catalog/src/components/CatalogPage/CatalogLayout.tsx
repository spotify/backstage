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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { Header, Page } from '@backstage/core-components';

type Props = {
  children?: React.ReactNode;
};

export const CatalogLayout = ({ children }: Props) => {
  const orgName =
    useApi(configApiRef).getOptionalString('organization.name') ?? 'Backstage';

  return (
    <Page themeId="home">
      <Header
        title={`${orgName} Catalog`}
        subtitle={`Catalog of software components at ${orgName}`}
        pageTitleOverride="Home"
      />
      {children}
    </Page>
  );
};

export default CatalogLayout;
