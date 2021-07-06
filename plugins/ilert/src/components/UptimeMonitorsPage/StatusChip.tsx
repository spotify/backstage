/*
 * Copyright 2021 The Backstage Authors
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
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import { UptimeMonitor } from '../../types';

const UpChip = withStyles({
  root: {
    backgroundColor: '#4caf50',
    color: 'white',
    margin: 0,
  },
})(Chip);

const DownChip = withStyles({
  root: {
    backgroundColor: '#d32f2f',
    color: 'white',
    margin: 0,
  },
})(Chip);

const UnknownChip = withStyles({
  root: {
    backgroundColor: '#92949c',
    color: 'white',
    margin: 0,
  },
})(Chip);

export const uptimeMonitorStatusLabels = {
  ['up']: 'Up',
  ['down']: 'Down',
  ['unknown']: 'Unknown',
} as Record<string, string>;

export const StatusChip = ({
  uptimeMonitor,
}: {
  uptimeMonitor: UptimeMonitor;
}) => {
  let label = `${uptimeMonitorStatusLabels[uptimeMonitor.status]}`;

  if (uptimeMonitor.paused) {
    label = 'Paused';
    return <UnknownChip label={label} size="small" />;
  }

  switch (uptimeMonitor.status) {
    case 'up':
      return <UpChip label={label} size="small" />;
    case 'down':
      return <DownChip label={label} size="small" />;
    case 'unknown':
      return <UnknownChip label={label} size="small" />;
    default:
      return <Chip label={label} size="small" />;
  }
};
