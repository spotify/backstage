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

import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { useState } from 'react';
import { IconComponent } from '@backstage/core-plugin-api';

// TODO(freben): It should probably instead be the case that Header sets the theme text color to white inside itself unconditionally instead
const useStyles = makeStyles({
  button: {
    color: 'white',
  },
});

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
type ExtraContextMenuItem = {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
};

type Props = {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  onUnregisterEntity: () => void;
};

export const EntityContextMenu = ({
  UNSTABLE_extraContextMenuItems,
  onUnregisterEntity,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const classes = useStyles();

  const onOpen = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(undefined);
  };

  const extraItems = UNSTABLE_extraContextMenuItems && [
    ...UNSTABLE_extraContextMenuItems.map(item => (
      <MenuItem
        key={item.title}
        onClick={() => {
          onClose();
          item.onClick();
        }}
      >
        <ListItemIcon>
          <item.Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </MenuItem>
    )),
    <Divider key="the divider is here!" />,
  ];

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={onOpen}
        data-testid="menu-button"
        className={classes.button}
      >
        <MoreVert />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          {extraItems}
          <MenuItem
            onClick={() => {
              onClose();
              onUnregisterEntity();
            }}
          >
            <ListItemIcon>
              <Cancel fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Unregister entity" />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
};
