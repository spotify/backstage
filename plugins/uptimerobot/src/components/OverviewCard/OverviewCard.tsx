/*
 * Copyright 2021 Spotify AB
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

import { Alert } from '@material-ui/lab';
import { InfoCard, Progress, useApi, useRouteRef } from '@backstage/core';
import { MonitorTable } from '../MonitorTable';
import { rootRouteRef } from '../../routes';
import { UPTIMEROBOT_MONITORS_ANNOTATION } from '../../../constants';
import { uptimerobotApiRef } from '../../api';
import { useAutoUpdatingRequest } from '../../hooks';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';

export const OverviewCard = () => {
  const uptimerobotApi = useApi(uptimerobotApiRef);
  const link = useRouteRef(rootRouteRef)();
  const { entity } = useEntity();

  const annotation =
    entity?.metadata?.annotations?.[UPTIMEROBOT_MONITORS_ANNOTATION];
  const { value, loading, error } = useAutoUpdatingRequest(() =>
    uptimerobotApi.getSingleMonitor(annotation),
  );

  return (
    <InfoCard
      title="UptimeRobot"
      subheader={`Automatically refreshes every ${uptimerobotApi.getUpdateInterval()} seconds.`}
      deepLink={{ title: 'Show overview', link }}
      noPadding
    >
      {loading && <Progress />}
      {error && <Alert severity="error">{error.message}</Alert>}

      {value && (
        <MonitorTable
          monitors={value.monitors}
          allowedColumns="name, currentStatus, uptimeHistory, otherRanges, id"
        />
      )}
    </InfoCard>
  );
};
