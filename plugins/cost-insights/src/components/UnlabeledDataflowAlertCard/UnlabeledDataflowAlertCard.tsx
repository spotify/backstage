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
import { Box } from '@material-ui/core';
import { BarChart, BarChartLegend } from '../BarChart';
import { UnlabeledDataflowData, ResourceData } from '../../types';
import { useBarChartLayoutStyles as useStyles } from '../../utils/styles';
import { InfoCard } from '@backstage/core-components';

type UnlabeledDataflowAlertProps = {
  alert: UnlabeledDataflowData;
};

export const UnlabeledDataflowAlertCard = ({
  alert,
}: UnlabeledDataflowAlertProps) => {
  const classes = useStyles();
  const projects = pluralize('project', alert.projects.length, true);
  const subheader = `
    Showing costs from ${projects} with unlabeled Dataflow jobs in the last 30 days.
  `;
  const options = {
    previousName: 'Unlabeled Cost',
    currentName: 'Labeled Cost',
  };

  const resources: ResourceData[] = alert.projects.map(project => ({
    name: project.id,
    previous: project.unlabeledCost,
    current: project.labeledCost,
  }));

  return (
    <InfoCard title="Label Dataflow" subheader={subheader}>
      <Box className={classes.wrapper}>
        <BarChartLegend
          costStart={alert.unlabeledCost}
          costEnd={alert.labeledCost}
          options={options}
        />
        <BarChart resources={resources} options={options} />
      </Box>
    </InfoCard>
  );
};
