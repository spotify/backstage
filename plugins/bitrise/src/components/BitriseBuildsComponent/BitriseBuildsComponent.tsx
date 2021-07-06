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

import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import { useBitriseBuildWorkflows } from '../../hooks/useBitriseBuildWorkflows';
import { AsyncState } from 'react-use/lib/useAsync';
import { BitriseBuildsTable } from '../BitriseBuildsTableComponent';
import { Item, Select } from '../Select';
import {
  Content,
  ContentHeader,
  MissingAnnotationEmptyState,
  Page,
} from '@backstage/core-components';

export type Props = {
  entity: Entity;
};

export const BITRISE_APP_ANNOTATION = 'bitrise.io/app';

export const isBitriseAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[BITRISE_APP_ANNOTATION]);

export const BitriseBuildsComponent = () => {
  const { entity } = useEntity();
  const appName = entity.metadata.annotations?.[
    BITRISE_APP_ANNOTATION
  ] as string;
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(' ');
  const workflows = useBitriseBuildWorkflows(appName);

  const onSelectedWorkflowChanged = (workflow: any) => {
    setSelectedWorkflow(workflow);
  };

  const getSelectionItems = (items: AsyncState<string[]>): Item[] => {
    const noWorkflowSpecified: Item = { label: 'All workflows', value: ' ' };
    return items.value
      ? [
          noWorkflowSpecified,
          ...items.value.map(item => {
            return { label: item, value: item };
          }),
        ]
      : [];
  };

  return (
    <>
      {!appName ? (
        <MissingAnnotationEmptyState annotation={BITRISE_APP_ANNOTATION} />
      ) : (
        <Page themeId="tool">
          <Content noPadding>
            <ContentHeader title={appName}>
              <Select
                value={selectedWorkflow}
                onChange={workflow => onSelectedWorkflowChanged(workflow)}
                label="Workflow"
                items={getSelectionItems(workflows)}
              />
            </ContentHeader>
            <BitriseBuildsTable
              appName={appName}
              workflow={selectedWorkflow}
              error={workflows.error}
            />
          </Content>
        </Page>
      )}
    </>
  );
};
