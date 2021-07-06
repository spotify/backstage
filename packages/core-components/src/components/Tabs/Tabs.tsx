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

import React, { useRef, useEffect, MutableRefObject, useState } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { chunkArray } from './utils';
import { useWindowSize } from 'react-use';

/* Import Components */

import { TabPanel } from './TabPanel';
import { StyledIcon } from './TabIcon';
import { StyledTab } from './Tab';
import { StyledTabs } from './TabBar';

/* Props Types */

export interface TabProps {
  content: any;
  label?: string;
  icon?: any; // TODO: define type for material-ui icons
}

export interface TabsProps {
  tabs: TabProps[];
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  styledTabs: {
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

export const Tabs = ({ tabs }: TabsProps) => {
  const classes = useStyles();
  const [value, setValue] = useState([0, 0]); // [selectedChunkedNavIndex, selectedIndex]
  const [navIndex, setNavIndex] = useState(0);
  const [numberOfChunkedElement, setNumberOfChunkedElement] = useState(0);
  const [chunkedTabs, setChunkedTabs] = useState<TabProps[][]>([[]]);
  const wrapper = useRef() as MutableRefObject<HTMLDivElement>;

  const { width } = useWindowSize();

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue([navIndex, newValue]);
  };

  const navigateToPrevChunk = () => {
    setNavIndex(navIndex - 1);
  };

  const navigateToNextChunk = () => {
    setNavIndex(navIndex + 1);
  };

  const hasNextNavIndex = () => navIndex + 1 < chunkedTabs.length;

  useEffect(() => {
    // Each time the window is resized we calculate how many tabs we can render given the window width
    const padding = 20; // The AppBar padding

    const numberOfTabIcons = navIndex === 0 ? 1 : 2;
    const wrapperWidth =
      wrapper.current.offsetWidth - padding - numberOfTabIcons * 30;
    const flattenIndex = value[0] * numberOfChunkedElement + value[1];
    const newChunkedElementSize = Math.floor(wrapperWidth / 170);

    setNumberOfChunkedElement(newChunkedElementSize);
    setChunkedTabs(chunkArray(tabs, newChunkedElementSize));
    setValue([
      Math.floor(flattenIndex / newChunkedElementSize),
      flattenIndex % newChunkedElementSize,
    ]);
    // eslint-disable-next-line
  }, [width, tabs]);

  const currentIndex = navIndex === value[0] ? value[1] : false;

  return (
    <div className={classes.root}>
      <AppBar ref={wrapper} className={classes.appbar} position="static">
        <div>
          <StyledTabs value={currentIndex} onChange={handleChange}>
            {navIndex !== 0 && (
              <StyledIcon
                onClick={navigateToPrevChunk}
                ariaLabel="navigate-before"
              >
                <NavigateBeforeIcon />
              </StyledIcon>
            )}
            {chunkedTabs[navIndex].map((tab, index) => (
              <StyledTab
                value={index}
                isFirstIndex={index === 0}
                isFirstNav={navIndex === 0}
                key={index}
                icon={tab.icon || undefined}
                label={tab.label || undefined}
              />
            ))}
            {hasNextNavIndex() && (
              <StyledIcon
                isNext
                onClick={navigateToNextChunk}
                ariaLabel="navigate-next"
              >
                <NavigateNextIcon />
              </StyledIcon>
            )}
          </StyledTabs>
        </div>
      </AppBar>
      {currentIndex !== false ? (
        chunkedTabs[navIndex].map((tab, index) => (
          <TabPanel key={index} value={index} index={currentIndex}>
            {tab.content}
          </TabPanel>
        ))
      ) : (
        // Render if the selected tab index is outside the current rendered chunked array
        <TabPanel
          key="panel_outside_chunked_array"
          value={value[1]}
          index={value[1]}
        >
          {chunkedTabs[value[0]][value[1]].content}
        </TabPanel>
      )}
    </div>
  );
};
