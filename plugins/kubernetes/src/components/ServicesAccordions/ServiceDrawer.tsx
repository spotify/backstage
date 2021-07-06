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
import { V1Service } from '@kubernetes/client-node';
import { KubernetesDrawer } from '../KubernetesDrawer/KubernetesDrawer';
import { Typography, Grid } from '@material-ui/core';

export const ServiceDrawer = ({
  service,
  expanded,
}: {
  service: V1Service;
  expanded?: boolean;
}) => {
  return (
    <KubernetesDrawer
      object={service}
      expanded={expanded}
      kind="Service"
      renderObject={(serviceObject: V1Service) => {
        return serviceObject.spec || {};
      }}
    >
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        spacing={0}
      >
        <Grid item>
          <Typography variant="h5">
            {service.metadata?.name ?? 'unknown object'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography color="textSecondary" variant="body1">
            Service
          </Typography>
        </Grid>
      </Grid>
    </KubernetesDrawer>
  );
};
