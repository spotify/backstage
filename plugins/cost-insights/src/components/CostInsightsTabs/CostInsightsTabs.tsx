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

import React, { useState } from 'react';
import { Menu, MenuItem, Tab, Tabs, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { mapLoadingToProps, mapFiltersToProps } from './selector';
import { Group } from '../../types';
import { useFilters, useLoading } from '../../hooks';
import { useCostInsightsTabsStyles as useStyles } from '../../utils/styles';

export type CostInsightsTabsProps = {
  groups: Group[];
};

export const CostInsightsTabs = ({ groups }: CostInsightsTabsProps) => {
  const classes = useStyles();
  const [index] = useState(0); // index is fixed for now until other tabs are added
  const [groupMenuEl, setGroupMenuEl] = useState<Element | null>(null);
  const { group, setGroup } = useFilters(mapFiltersToProps);
  const { loadingActions, dispatchReset } = useLoading(mapLoadingToProps);

  const openGroupMenu = (e: any) => setGroupMenuEl(e.currentTarget as Element);

  const closeGroupMenu = () => setGroupMenuEl(null);

  const updateGroupFilterAndCloseMenu = (g: Group) => () => {
    dispatchReset(loadingActions);
    closeGroupMenu();
    setGroup(g);
  };

  const renderTabLabel = () => (
    <div className={classes.tabLabel}>
      <Typography className={classes.tabLabelText} variant="overline">
        {`${groups.length} teams`}
      </Typography>
      <ExpandMoreIcon fontSize="small" />
    </div>
  );

  const hasAtLeastTwoGroups = groups.length >= 2;

  if (!hasAtLeastTwoGroups) return null;

  return (
    <>
      <Tabs
        className={`cost-insights-tabs ${classes.tabs}`}
        data-testid="cost-insights-tabs"
        classes={{ indicator: classes.indicator }}
        value={index}
      >
        <Tab
          className={classes.tab}
          data-testid="cost-insights-groups-tab"
          key="cost-insights-groups-tab"
          label={renderTabLabel()}
          onClick={openGroupMenu}
          component="button"
        />
      </Tabs>
      <Menu
        id="group-menu"
        data-testid="group-menu"
        className={classes.menu}
        getContentAnchorEl={null}
        anchorEl={groupMenuEl}
        keepMounted
        open={Boolean(groupMenuEl)}
        onClose={closeGroupMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {groups.map((g: Group) => (
          <MenuItem
            className={classes.menuItem}
            classes={{ selected: classes.menuItemSelected }}
            selected={g.id === group}
            key={g.id}
            data-testid={g.id}
            onClick={updateGroupFilterAndCloseMenu(g)}
          >
            {g.id}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
