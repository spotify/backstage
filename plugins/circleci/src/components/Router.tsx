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
import { Routes, Route } from 'react-router';
import { circleCIRouteRef, circleCIBuildRouteRef } from '../route-refs';
import { BuildWithStepsPage } from './BuildWithStepsPage/';
import { BuildsPage } from './BuildsPage';
import { CIRCLECI_ANNOTATION } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

export const isCircleCIAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CIRCLECI_ANNOTATION]);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const Router = (_props: Props) => {
  const { entity } = useEntity();

  if (!isCircleCIAvailable(entity)) {
    return <MissingAnnotationEmptyState annotation={CIRCLECI_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route path={`/${circleCIRouteRef.path}`} element={<BuildsPage />} />
      <Route
        path={`/${circleCIBuildRouteRef.path}`}
        element={<BuildWithStepsPage />}
      />
    </Routes>
  );
};
