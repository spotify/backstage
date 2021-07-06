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

import React, { ReactNode, PropsWithChildren } from 'react';
import classnames from 'classnames';
import { Box, Divider, Typography } from '@material-ui/core';
import { useTooltipStyles as useStyles } from '../../utils/styles';

export type BarChartTooltipProps = {
  title: string;
  content?: ReactNode | string;
  subtitle?: ReactNode;
  topRight?: ReactNode;
  actions?: ReactNode;
};

export const BarChartTooltip = ({
  title,
  content,
  subtitle,
  topRight,
  actions,
  children,
}: PropsWithChildren<BarChartTooltipProps>) => {
  const classes = useStyles();
  const titleClassName = classnames(classes.truncate, {
    [classes.maxWidth]: topRight === undefined,
  });

  return (
    <Box className={classes.tooltip} display="flex" flexDirection="column">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="baseline"
        px={2}
        pt={2}
      >
        <Box display="flex" flexDirection="column">
          <Typography className={titleClassName} variant="h6">
            {title}
          </Typography>
          {subtitle && (
            <Typography className={classes.subtitle} variant="subtitle1">
              {subtitle}
            </Typography>
          )}
        </Box>
        {topRight && <Box ml={2}>{topRight}</Box>}
      </Box>
      {content && (
        <Box px={2} pt={2} className={classes.maxWidth}>
          <Typography variant="body1" paragraph>
            {content}
          </Typography>
        </Box>
      )}
      <Box display="flex" flexDirection="column" p={2}>
        {children}
      </Box>
      {actions && (
        <>
          <Divider className={classes.divider} variant="fullWidth" />
          <Box display="flex" flexDirection="column" p={2}>
            {actions}
          </Box>
        </>
      )}
    </Box>
  );
};
