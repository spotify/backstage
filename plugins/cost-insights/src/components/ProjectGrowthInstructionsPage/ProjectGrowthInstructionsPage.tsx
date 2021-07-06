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
import { DateTime } from 'luxon';
import { Box, Typography } from '@material-ui/core';
import { AlertInstructionsLayout } from '../AlertInstructionsLayout';
import { ProductInsightsChart } from '../ProductInsightsCard';
import {
  Alert,
  DEFAULT_DATE_FORMAT,
  Duration,
  Entity,
  Product,
  ProjectGrowthData,
} from '../../types';
import { ProjectGrowthAlert } from '../../alerts';
import { InfoCard } from '@backstage/core-components';

const today = DateTime.now().toFormat(DEFAULT_DATE_FORMAT);

export const ProjectGrowthInstructionsPage = () => {
  const alertData: ProjectGrowthData = {
    project: 'example-project',
    periodStart: 'Q1 2020',
    periodEnd: 'Q2 2020',
    aggregation: [60000, 120000],
    change: {
      ratio: 1,
      amount: 60000,
    },
    products: [
      {
        id: 'Compute Engine',
        aggregation: [58000, 118000],
      },
      {
        id: 'Cloud Dataflow',
        aggregation: [1200, 1500],
      },
      {
        id: 'Cloud Storage',
        aggregation: [800, 500],
      },
    ],
  };

  const projectGrowthAlert: Alert = new ProjectGrowthAlert(alertData);

  const product: Product = {
    kind: 'ComputeEngine',
    name: 'Compute Engine',
  };

  const entity: Entity = {
    id: 'example-id',
    aggregation: [20_000, 60_000],
    change: {
      ratio: 3,
      amount: 40_000,
    },
    entities: {
      service: [
        {
          id: 'service-one',
          aggregation: [18_200, 58_500],
          entities: {},
          change: { ratio: 2.21, amount: 40_300 },
        },
        {
          id: 'service-two',
          aggregation: [1200, 1300],
          entities: {},
          change: { ratio: 0.083, amount: 100 },
        },
        {
          id: 'service-three',
          aggregation: [600, 200],
          entities: {},
          change: { ratio: -0.666, amount: -400 },
        },
      ],
    },
  };

  return (
    <AlertInstructionsLayout title="Investigating Growth">
      <Typography variant="h1">Investigating cloud cost growth</Typography>
      <Typography paragraph>
        Cost Insights shows an alert when costs for a particular billing entity,
        such as a GCP project, have grown at a rate faster than our alerting
        threshold. The responsible team should follow this guide to decide
        whether this warrants further investigation.
      </Typography>

      <Box mt={4}>
        <Typography variant="h3">Is the growth expected?</Typography>
        <Typography paragraph>
          The first question to ask is whether growth is expected. Perhaps a new
          product has been deployed, or additional regions added for
          reliability.
        </Typography>
        <Typography paragraph>
          Many services increase cost linearly with load. Has the demand
          increased? This may happen as you open new markets, or run marketing
          offers. Costs should be compared against a business metric, such as
          daily users, to normalize natural increases from business growth.
        </Typography>
        <Typography paragraph>
          Seasonal variance may also cause cost growth; yearly campaigns, an
          increase in demand during certain times of year.
        </Typography>
        <Typography paragraph>
          Cloud costs will often go up before they go down, in the case of
          migrations. Teams moving to new infrastructure may run in both the old
          and new environment during the migration.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h3">Is the growth significant?</Typography>
        <Typography paragraph>
          Next, evaluate whether the growth is significant. This helps avoid
          premature optimization, where cost in engineering time is more than
          would be saved from the optimization over a reasonable time frame.
        </Typography>
        <Typography paragraph>
          We recommend reframing the cost growth itself in terms of engineering
          time. How much engineering time, for an <i>average</i> fully-loaded
          engineer cost at the company, is being overspent each month? Compare
          this to expected engineering time for optimization to decide whether
          the optimization is worthwhile.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h3">
          Identifying which cloud product contributed most
        </Typography>
        <Typography paragraph>
          For projects meeting the alert threshold, Cost Insights shows a cost
          comparison of cloud products over the examined time period:
        </Typography>
        <Box mt={2} mb={2}>
          {projectGrowthAlert.element}
        </Box>
        <Typography paragraph>
          This allows you to quickly see which cloud products contributed to the
          growth in cloud costs.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h3">
          Identifying the responsible workload
        </Typography>
        <Typography paragraph>
          After identifying the cloud product, use the corresponding product
          panel in Cost Insights to find a particular workload (or <i>entity</i>
          ) that has grown in cost:
        </Typography>
        <Box mt={2} mb={2}>
          <InfoCard title={product.name} subheader="3 entities, sorted by cost">
            <ProductInsightsChart
              billingDate={today}
              duration={Duration.P3M}
              entity={entity}
            />
          </InfoCard>
        </Box>
        <Typography paragraph>
          From here, you can dig into commit history or deployment logs to find
          probable causes of an unexpected spike in cost.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h3">Optimizing the workload</Typography>
        <Typography paragraph>
          Workload optimization varies between cloud products, but there are a
          few general optimization areas to consider:
        </Typography>
        <Typography variant="h5">Retention</Typography>
        <Typography paragraph>
          Is the workload or storage necessary? Truly idle or unused resources
          can be cleaned up for immediate cost savings. For storage, how long do
          we need the data? Many cloud products support retention policies to
          automatically delete data after a certain time period.
        </Typography>
        <Typography variant="h5">Efficiency</Typography>
        <Typography paragraph>
          Is the workload using cloud resources efficiently? For compute
          resources, do the utilization metrics look reasonable? Autoscaling
          infrastructure, such as Kubernetes, can run workloads more efficiently
          without compromising reliability.
        </Typography>
        <Typography variant="h5">Lifecycle</Typography>
        <Typography paragraph>
          Is the workload using an optimal pricing model? Some cloud products
          offer better pricing for data that is accessed less frequently.
        </Typography>
      </Box>
    </AlertInstructionsLayout>
  );
};
