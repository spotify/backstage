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
import pluralize from 'pluralize';
import { ProjectGrowthAlertChart } from './ProjectGrowthAlertChart';
import { ProjectGrowthData } from '../../types';
import { InfoCard } from '@backstage/core-components';

type ProjectGrowthAlertProps = {
  alert: ProjectGrowthData;
};

export const ProjectGrowthAlertCard = ({ alert }: ProjectGrowthAlertProps) => {
  const subheader = `
    ${pluralize('product', alert.products.length, true)}${
    alert.products.length > 1 ? ', sorted by cost' : ''
  }`;

  return (
    <InfoCard
      title={`Project growth for ${alert.project}`}
      subheader={subheader}
    >
      <ProjectGrowthAlertChart alert={alert} />
    </InfoCard>
  );
};
