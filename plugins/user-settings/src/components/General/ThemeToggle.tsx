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

import React, { cloneElement } from 'react';
import { useObservable } from 'react-use';
import AutoIcon from '@material-ui/icons/BrightnessAuto';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  makeStyles,
} from '@material-ui/core';
import { appThemeApiRef, useApi } from '@backstage/core-plugin-api';

type ThemeIconProps = {
  id: string;
  activeId: string | undefined;
  icon: JSX.Element | undefined;
};

const ThemeIcon = ({ id, activeId, icon }: ThemeIconProps) =>
  icon ? (
    cloneElement(icon, {
      color: activeId === id ? 'primary' : undefined,
    })
  ) : (
    <AutoIcon color={activeId === id ? 'primary' : undefined} />
  );

type TooltipToggleButtonProps = {
  children: JSX.Element;
  title: string;
  value: string;
};

const useStyles = makeStyles(theme => ({
  list: {
    [theme.breakpoints.down('xs')]: {
      padding: `0 0 12px`,
    },
  },
  listItemText: {
    [theme.breakpoints.down('xs')]: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  listItemSecondaryAction: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      top: 'auto',
      right: 'auto',
      position: 'relative',
      transform: 'unset',
    },
  },
}));

// ToggleButtonGroup uses React.children.map instead of context
// so wrapping with Tooltip breaks ToggleButton functionality.
const TooltipToggleButton = ({
  children,
  title,
  value,
  ...props
}: TooltipToggleButtonProps) => (
  <Tooltip placement="top" arrow title={title}>
    <ToggleButton value={value} {...props}>
      {children}
    </ToggleButton>
  </Tooltip>
);

export const ThemeToggle = () => {
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const themeIds = appThemeApi.getInstalledThemes();

  const handleSetTheme = (
    _event: React.MouseEvent<HTMLElement>,
    newThemeId: string | undefined,
  ) => {
    if (themeIds.some(t => t.id === newThemeId)) {
      appThemeApi.setActiveThemeId(newThemeId);
    } else {
      appThemeApi.setActiveThemeId(undefined);
    }
  };

  return (
    <ListItem className={classes.list}>
      <ListItemText
        className={classes.listItemText}
        primary="Theme"
        secondary="Change the theme mode"
      />
      <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={themeId ?? 'auto'}
          onChange={handleSetTheme}
        >
          {themeIds.map(theme => {
            const themeIcon = themeIds.find(t => t.id === theme.id)?.icon;
            return (
              <TooltipToggleButton
                key={theme.id}
                title={`Select ${theme.title}`}
                value={theme.id}
              >
                <>
                  {theme.variant}&nbsp;
                  <ThemeIcon
                    id={theme.id}
                    icon={themeIcon}
                    activeId={themeId}
                  />
                </>
              </TooltipToggleButton>
            );
          })}
          <Tooltip placement="top" arrow title="Select auto theme">
            <ToggleButton value="auto" selected={themeId === undefined}>
              Auto&nbsp;
              <AutoIcon color={themeId === undefined ? 'primary' : undefined} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
