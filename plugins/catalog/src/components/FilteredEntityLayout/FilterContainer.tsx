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

import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  Button,
  Drawer,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import React, { useState } from 'react';

export const FilterContainer = ({ children }: React.PropsWithChildren<{}>) => {
  const isMidSizeScreen = useMediaQuery<BackstageTheme>(theme =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme<BackstageTheme>();
  const [showFiltersDrawer, toggleFiltersDrawer] = useState<boolean>(false);

  return isMidSizeScreen ? (
    <>
      <Button
        style={{ marginTop: theme.spacing(1), marginLeft: theme.spacing(1) }}
        onClick={() => toggleFiltersDrawer(!showFiltersDrawer)}
      >
        <Box display="flex" alignItems="center">
          <FilterListIcon style={{ marginRight: theme.spacing(1) }} />
          Filters
        </Box>
      </Button>
      <Drawer
        title="Filters"
        data-testid="entity-filters-drawer"
        open={showFiltersDrawer}
        onClose={() => {
          toggleFiltersDrawer(false);
        }}
        elevation={0}
        anchor="left"
        disableAutoFocus
        keepMounted
        variant="temporary"
      >
        <Box m={2}>
          <Typography
            variant="h6"
            component="h2"
            style={{ marginBottom: theme.spacing(1) }}
          >
            Filters
          </Typography>
          {children}
        </Box>
      </Drawer>
    </>
  ) : (
    <Grid data-testid="entity-filters-grid" item lg={2}>
      {children}
    </Grid>
  );
};
