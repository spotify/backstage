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
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Routes, Route } from 'react-router';
import { rootRouteRef, buildRouteRef } from '../routes';
import { WorkflowRunDetails } from './WorkflowRunDetails';
import { WorkflowRunsTable } from './WorkflowRunsTable';
import { CLOUDBUILD_ANNOTATION } from './useProjectName';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

export const isCloudbuildAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CLOUDBUILD_ANNOTATION]);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const Router = (_props: Props) => {
  const { entity } = useEntity();

  if (!isCloudbuildAvailable(entity)) {
    // TODO(shmidt-i): move warning to a separate standardized component
    return <MissingAnnotationEmptyState annotation={CLOUDBUILD_ANNOTATION} />;
  }
  return (
    <Routes>
      <Route
        path={`/${rootRouteRef.path}`}
        element={<WorkflowRunsTable entity={entity} />}
      />
      <Route
        path={`/${buildRouteRef.path}`}
        element={<WorkflowRunDetails entity={entity} />}
      />
      )
    </Routes>
  );
};
