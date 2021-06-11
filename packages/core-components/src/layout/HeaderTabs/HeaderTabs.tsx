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

// TODO(blam): Remove this implementation when the Tabs are ready
// This is just a temporary solution to implementing tabs for now

import React, { useState, useEffect } from 'react';
import { makeStyles, Tabs, Tab as TabUI, TabProps } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tabsWrapper: {
    gridArea: 'pageSubheader',
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3),
  },
  defaultTab: {
    padding: theme.spacing(3, 3),
    ...theme.typography.caption,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
  },
  selected: {
    color: theme.palette.text.primary,
  },
}));

export type Tab = {
  id: string;
  label: string;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

type HeaderTabsProps = {
  tabs: Tab[];
  onChange?: (index: number) => void;
  selectedIndex?: number;
};
export const HeaderTabs = ({
  tabs,
  onChange,
  selectedIndex,
}: HeaderTabsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(selectedIndex ?? 0);
  const styles = useStyles();

  const handleChange = (_: React.ChangeEvent<{}>, index: number) => {
    if (selectedIndex === undefined) {
      setSelectedTab(index);
    }
    if (onChange) onChange(index);
  };

  useEffect(() => {
    if (selectedIndex !== undefined) {
      setSelectedTab(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <div className={styles.tabsWrapper}>
      <Tabs
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        onChange={handleChange}
        value={selectedTab}
      >
        {tabs.map((tab, index) => (
          <TabUI
            {...tab.tabProps}
            label={tab.label}
            key={tab.id}
            value={index}
            className={styles.defaultTab}
            classes={{ selected: styles.selected }}
          />
        ))}
      </Tabs>
    </div>
  );
};
