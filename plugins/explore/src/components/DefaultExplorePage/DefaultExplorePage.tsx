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
import { DomainExplorerContent } from '../DomainExplorerContent';
import { ExploreLayout } from '../ExploreLayout';
import { GroupsExplorerContent } from '../GroupsExplorerContent';
import { ToolExplorerContent } from '../ToolExplorerContent';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const DefaultExplorePage = () => {
  const configApi = useApi(configApiRef);
  const organizationName =
    configApi.getOptionalString('organization.name') ?? 'Backstage';

  return (
    <ExploreLayout
      title={`Explore the ${organizationName} ecosystem`}
      subtitle="Discover solutions available in your ecosystem"
    >
      <ExploreLayout.Route path="domains" title="Domains">
        <DomainExplorerContent />
      </ExploreLayout.Route>
      <ExploreLayout.Route path="groups" title="Groups">
        <GroupsExplorerContent />
      </ExploreLayout.Route>
      <ExploreLayout.Route path="tools" title="Tools">
        <ToolExplorerContent />
      </ExploreLayout.Route>
    </ExploreLayout>
  );
};
