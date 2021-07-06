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
import { IconButton, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ShortcutIcon } from './ShortcutIcon';
import { EditShortcut } from './EditShortcut';
import { ShortcutApi } from './api';
import { Shortcut } from './types';
import { SidebarItem } from '@backstage/core-components';

const useStyles = makeStyles({
  root: {
    '&:hover #edit': {
      visibility: 'visible',
    },
  },
  button: {
    visibility: 'hidden',
  },
  icon: {
    color: 'white',
    fontSize: 16,
  },
});

const getIconText = (title: string) =>
  title.split(' ').length === 1
    ? // If there's only one word, keep the first two characters
      title[0].toUpperCase() + title[1].toLowerCase()
    : // If there's more than one word, take the first character of the first two words
      title
        .replace(/\B\W/g, '')
        .split(' ')
        .map(s => s[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

type Props = {
  shortcut: Shortcut;
  api: ShortcutApi;
};

export const ShortcutItem = ({ shortcut, api }: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<Element | undefined>();

  const handleClick = (event: React.MouseEvent<Element>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const text = getIconText(shortcut.title);
  const color = api.getColor(shortcut.url);

  return (
    <>
      <SidebarItem
        className={classes.root}
        to={shortcut.url}
        text={shortcut.title}
        icon={() => <ShortcutIcon text={text} color={color} />}
      >
        <IconButton
          id="edit"
          data-testid="edit"
          onClick={handleClick}
          className={classes.button}
        >
          <EditIcon className={classes.icon} />
        </IconButton>
      </SidebarItem>
      <EditShortcut
        onClose={handleClose}
        anchorEl={anchorEl}
        api={api}
        shortcut={shortcut}
      />
    </>
  );
};
