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
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { FeatureFlag } from '@backstage/core-plugin-api';

type Props = {
  flag: FeatureFlag;
  enabled: boolean;
  toggleHandler: Function;
};

export const FlagItem = ({ flag, enabled, toggleHandler }: Props) => (
  <ListItem>
    <ListItemText
      primary={flag.name}
      secondary={`Registered in ${flag.pluginId} plugin`}
    />
    <ListItemSecondaryAction>
      <Tooltip placement="top" arrow title={enabled ? 'Disable' : 'Enable'}>
        <Switch
          color="primary"
          checked={enabled}
          onChange={() => toggleHandler(flag.name)}
          name={flag.name}
        />
      </Tooltip>
    </ListItemSecondaryAction>
  </ListItem>
);
