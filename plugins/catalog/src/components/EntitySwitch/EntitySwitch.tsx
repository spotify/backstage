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

import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { PropsWithChildren, ReactNode } from 'react';
import {
  attachComponentData,
  useElementFilter,
} from '@backstage/core-plugin-api';

const ENTITY_SWITCH_KEY = 'core.backstage.entitySwitch';

const EntitySwitchCase = (_: {
  if?: (entity: Entity) => boolean;
  children: ReactNode;
}) => null;

attachComponentData(EntitySwitchCase, ENTITY_SWITCH_KEY, true);

type SwitchCase = {
  if?: (entity: Entity) => boolean;
  children: JSX.Element;
};

export const EntitySwitch = ({ children }: PropsWithChildren<{}>) => {
  const { entity } = useEntity();
  const switchCases = useElementFilter(children, collection =>
    collection
      .selectByComponentData({
        key: ENTITY_SWITCH_KEY,
        withStrictError: 'Child of EntitySwitch is not an EntitySwitch.Case',
      })
      .getElements()
      .flatMap<SwitchCase>((element: React.ReactElement) => {
        const { if: condition, children: elementsChildren } = element.props;
        return [{ if: condition, children: elementsChildren }];
      }),
  );

  const matchingCase = switchCases.find(switchCase =>
    switchCase.if ? switchCase.if(entity) : true,
  );
  return matchingCase?.children ?? null;
};

EntitySwitch.Case = EntitySwitchCase;
