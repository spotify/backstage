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
import { Route, Routes } from 'react-router-dom';
import { useEntity } from '@backstage/plugin-catalog-react';
import AuditList from './components/AuditList';
import AuditView, { AuditViewContent } from './components/AuditView';
import CreateAudit, { CreateAuditContent } from './components/CreateAudit';
import { Entity } from '@backstage/catalog-model';
import { LIGHTHOUSE_WEBSITE_URL_ANNOTATION } from '../constants';
import { AuditListForEntity } from './components/AuditList/AuditListForEntity';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

export const isLighthouseAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[LIGHTHOUSE_WEBSITE_URL_ANNOTATION]);

export const Router = () => (
  <Routes>
    <Route path="/" element={<AuditList />} />
    <Route path="/audit/:id" element={<AuditView />} />
    <Route path="/create-audit" element={<CreateAudit />} />
  </Routes>
);

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
};

export const EmbeddedRouter = (_props: Props) => {
  const { entity } = useEntity();

  if (!isLighthouseAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState
        annotation={LIGHTHOUSE_WEBSITE_URL_ANNOTATION}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuditListForEntity />} />
      <Route path="/audit/:id" element={<AuditViewContent />} />
      <Route path="/create-audit" element={<CreateAuditContent />} />
    </Routes>
  );
};
