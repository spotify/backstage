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
import { AuditListTable } from './AuditListTable';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import { Progress } from '@backstage/core-components';

export const AuditListForEntity = () => {
  const { value, loading, error } = useWebsiteForEntity();
  if (loading) {
    return <Progress />;
  }
  if (error || !value) {
    return null;
  }

  return <AuditListTable data-test-id="AuditListTable" items={[value]} />;
};
