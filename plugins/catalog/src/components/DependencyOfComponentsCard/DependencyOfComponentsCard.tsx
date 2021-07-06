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

import { RELATION_DEPENDENCY_OF } from '@backstage/catalog-model';
import React from 'react';
import {
  asComponentEntities,
  componentEntityColumns,
  componentEntityHelpLink,
  RelatedEntitiesCard,
} from '../RelatedEntitiesCard';

type Props = {
  variant?: 'gridItem';
  title?: string;
};

export const DependencyOfComponentsCard = ({
  variant = 'gridItem',
  title = 'Dependency of components',
}: Props) => {
  return (
    <RelatedEntitiesCard
      variant={variant}
      title={title}
      entityKind="Component"
      relationType={RELATION_DEPENDENCY_OF}
      columns={componentEntityColumns}
      emptyMessage="No component depends on this component"
      emptyHelpLink={componentEntityHelpLink}
      asRenderableEntities={asComponentEntities}
    />
  );
};
