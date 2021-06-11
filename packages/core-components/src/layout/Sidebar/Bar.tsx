/*
 * Copyright 2020 Spotify AB
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

import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useRef, useState, useContext, PropsWithChildren } from 'react';
import { sidebarConfig, SidebarContext } from './config';
import { BackstageTheme } from '@backstage/theme';
import { SidebarPinStateContext } from './Page';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    zIndex: 1000,
    position: 'relative',
    overflow: 'visible',
    width: theme.spacing(7) + 1,
  },
  drawer: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    padding: 0,
    background: theme.palette.navigation.background,
    overflowX: 'hidden',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    width: sidebarConfig.drawerWidthClosed,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
    '& > *': {
      flexShrink: 0,
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  drawerOpen: {
    width: sidebarConfig.drawerWidthOpen,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  drawerPeek: {
    width: sidebarConfig.drawerWidthClosed + 4,
  },
}));

enum State {
  Closed,
  Peek,
  Open,
}

type Props = {
  openDelayMs?: number;
  closeDelayMs?: number;
};

export const Sidebar = ({
  openDelayMs = sidebarConfig.defaultOpenDelayMs,
  closeDelayMs = sidebarConfig.defaultCloseDelayMs,
  children,
}: PropsWithChildren<Props>) => {
  const classes = useStyles();
  const [state, setState] = useState(State.Closed);
  const hoverTimerRef = useRef<number>();
  const { isPinned } = useContext(SidebarPinStateContext);

  const handleOpen = () => {
    if (isPinned) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state !== State.Open) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Open);
      }, openDelayMs);

      setState(State.Peek);
    }
  };

  const handleClose = () => {
    if (isPinned) {
      return;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = undefined;
    }
    if (state === State.Peek) {
      setState(State.Closed);
    } else if (state === State.Open) {
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = undefined;
        setState(State.Closed);
      }, closeDelayMs);
    }
  };

  return (
    <div
      className={classes.root}
      onMouseEnter={handleOpen}
      onFocus={handleOpen}
      onMouseLeave={handleClose}
      onBlur={handleClose}
      data-testid="sidebar-root"
    >
      <SidebarContext.Provider
        value={{
          isOpen: state === State.Open || isPinned,
        }}
      >
        <div
          className={clsx(classes.drawer, {
            [classes.drawerPeek]: state === State.Peek,
            [classes.drawerOpen]: state === State.Open || isPinned,
          })}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    </div>
  );
};
