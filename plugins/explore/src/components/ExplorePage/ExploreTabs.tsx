/*
 * Copyright 2021 Spotify AB
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
import { TabbedLayout } from '@backstage/core';
import React from 'react';
import { DomainExplorerContent } from '../DomainExplorerContent';
import { GroupsExplorerContent } from '../GroupsExplorerContent';
import { ToolExplorerContent } from '../ToolExplorerContent';

export const ExploreTabs = () => (
  <TabbedLayout>
    <TabbedLayout.Route path="domains" title="Domains">
      <DomainExplorerContent />
    </TabbedLayout.Route>
    <TabbedLayout.Route path="groups" title="Groups">
      <GroupsExplorerContent />
    </TabbedLayout.Route>
    <TabbedLayout.Route path="tools" title="Tools">
      <ToolExplorerContent />
    </TabbedLayout.Route>
  </TabbedLayout>
);
