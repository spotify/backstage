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
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { sidebarConfig } from './config';
import { BackstageTheme } from '@backstage/theme';
import { LocalStorage } from './localStorage';

const useStyles = makeStyles<BackstageTheme, { isPinned: boolean }>({
  root: {
    width: '100%',
    minHeight: '100%',
    transition: 'padding-left 0.1s ease-out',
    paddingLeft: ({ isPinned }) =>
      isPinned
        ? sidebarConfig.drawerWidthOpen
        : sidebarConfig.drawerWidthClosed,
  },
});

export type SidebarPinStateContextType = {
  isPinned: boolean;
  toggleSidebarPinState: () => any;
};

export const SidebarPinStateContext = createContext<SidebarPinStateContextType>(
  {
    isPinned: false,
    toggleSidebarPinState: () => {},
  },
);

export const SidebarPage = (props: PropsWithChildren<{}>) => {
  const [isPinned, setIsPinned] = useState(() =>
    LocalStorage.getSidebarPinState(),
  );

  useEffect(() => {
    LocalStorage.setSidebarPinState(isPinned);
  }, [isPinned]);

  const toggleSidebarPinState = () => setIsPinned(!isPinned);

  const classes = useStyles({ isPinned });
  return (
    <SidebarPinStateContext.Provider
      value={{
        isPinned,
        toggleSidebarPinState,
      }}
    >
      <div className={classes.root}>{props.children}</div>
    </SidebarPinStateContext.Provider>
  );
};
