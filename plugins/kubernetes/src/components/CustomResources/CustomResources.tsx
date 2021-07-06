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

import React, { useContext } from 'react';
import lodash, { Dictionary } from 'lodash';
import { RolloutAccordions } from './ArgoRollouts';
import { DefaultCustomResourceAccordions } from './DefaultCustomResource';
import { GroupedResponsesContext } from '../../hooks';

interface CustomResourcesProps {
  children?: React.ReactNode;
}

const kindToResource = (customResources: any[]): Dictionary<any[]> => {
  return lodash.groupBy(customResources, value => {
    return value.kind;
  });
};

export const CustomResources = ({}: CustomResourcesProps) => {
  const groupedResponses = useContext(GroupedResponsesContext);
  const kindToResourceMap = kindToResource(groupedResponses.customResources);

  return (
    <>
      {Object.entries(kindToResourceMap).map(([kind, resources], i) => {
        switch (kind) {
          case 'Rollout':
            return <RolloutAccordions key={i} rollouts={resources} />;
          default:
            return (
              <DefaultCustomResourceAccordions
                key={i}
                customResources={resources}
                customResourceName={kind}
              />
            );
        }
      })}
    </>
  );
};
