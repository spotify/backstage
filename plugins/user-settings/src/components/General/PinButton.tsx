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

import React, { useContext } from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  Tooltip,
} from '@material-ui/core';
import { SidebarPinStateContext } from '@backstage/core-components';

export const PinButton = () => {
  const { isPinned, toggleSidebarPinState } = useContext(
    SidebarPinStateContext,
  );

  return (
    <ListItem>
      <ListItemText
        primary="Pin Sidebar"
        secondary="Prevent the sidebar from collapsing"
      />
      <ListItemSecondaryAction>
        <Tooltip
          placement="top"
          arrow
          title={`${isPinned ? 'Unpin' : 'Pin'} Sidebar`}
        >
          <Switch
            color="primary"
            checked={isPinned}
            onChange={() => toggleSidebarPinState()}
            name="pin"
            inputProps={{ 'aria-label': 'Pin Sidebar Switch' }}
          />
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
