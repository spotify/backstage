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
import { Box } from '@material-ui/core';
import { KubernetesMigrationBarChartLegend } from './KubernetesMigrationBarChartLegend';
import { KubernetesMigrationBarChart } from './KubernetesMigrationBarChart';
import { KubernetesMigrationData } from '../../alerts';
import { InfoCard } from '@backstage/core-components';

type KubernetesMigrationAlertProps = {
  data: KubernetesMigrationData;
  title: string;
  subheader: string;
  currentProduct: string;
  comparedProduct: string;
};

export const KubernetesMigrationAlertCard = ({
  data,
  title,
  subheader,
  currentProduct,
  comparedProduct,
}: KubernetesMigrationAlertProps) => {
  return (
    <InfoCard title={title} subheader={subheader}>
      <Box display="flex" flexDirection="column">
        <Box paddingY={1}>
          <KubernetesMigrationBarChartLegend
            startDate={data.startDate}
            change={data.change}
            currentProduct={currentProduct}
            comparedProduct={comparedProduct}
          />
        </Box>
        <Box paddingY={1}>
          <KubernetesMigrationBarChart
            services={data.services}
            currentProduct={currentProduct}
            comparedProduct={comparedProduct}
          />
        </Box>
      </Box>
    </InfoCard>
  );
};
