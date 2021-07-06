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
import { PanelType, TechDocsCustomHome } from './TechDocsCustomHome';

export const TechDocsHome = () => {
  const tabsConfig = [
    {
      label: 'Overview',
      panels: [
        {
          title: 'Overview',
          description:
            'Explore your internal technical ecosystem through documentation.',
          panelType: 'DocsCardGrid' as PanelType,
          filterPredicate: () => true,
        },
        // uncomment this if you would like to have a secondary panel with owned documents
        // {
        //   title: 'Owned',
        //   description: 'Explore your owned internal documentation.',
        //   panelType: 'DocsCardGrid' as PanelType,
        //   filterPredicate: 'ownedByUser',
        // },
      ],
    },
    {
      label: 'Owned Documents',
      panels: [
        {
          title: 'Owned documents',
          description: 'Access your documentation.',
          panelType: 'DocsTable' as PanelType,
          // ownedByUser filters out entities owned by signed in user
          filterPredicate: 'ownedByUser',
        },
      ],
    },
  ];
  return <TechDocsCustomHome tabsConfig={tabsConfig} />;
};
