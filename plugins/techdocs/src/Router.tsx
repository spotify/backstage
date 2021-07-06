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
import { Route, Routes } from 'react-router-dom';
import {
  rootRouteRef,
  rootDocsRouteRef,
  rootCatalogDocsRouteRef,
} from './routes';
import { TechDocsHome } from './home/components/TechDocsHome';
import { TechDocsPage } from './reader/components/TechDocsPage';
import { EntityPageDocs } from './EntityPageDocs';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';

export const Router = () => {
  return (
    <Routes>
      <Route path={`/${rootRouteRef.path}`} element={<TechDocsHome />} />
      <Route path={`/${rootDocsRouteRef.path}`} element={<TechDocsPage />} />
    </Routes>
  );
};

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const EmbeddedDocsRouter = (_props: Props) => {
  const { entity } = useEntity();

  const projectId = entity.metadata.annotations?.[TECHDOCS_ANNOTATION];

  if (!projectId) {
    return <MissingAnnotationEmptyState annotation={TECHDOCS_ANNOTATION} />;
  }

  return (
    <Routes>
      <Route
        path={`/${rootCatalogDocsRouteRef.path}`}
        element={<EntityPageDocs entity={entity} />}
      />
    </Routes>
  );
};
