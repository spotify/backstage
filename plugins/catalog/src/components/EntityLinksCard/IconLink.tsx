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

import { makeStyles, Box, Typography } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import React from 'react';

import { Link } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  svgIcon: {
    display: 'inline-block',
    '& svg': {
      display: 'inline-block',
      fontSize: 'inherit',
      verticalAlign: 'baseline',
    },
  },
});

export const IconLink = ({
  href,
  text,
  Icon,
}: {
  href: string;
  text?: string;
  Icon?: IconComponent;
}) => {
  const classes = useStyles();

  return (
    <Box display="flex">
      <Box mr={1} className={classes.svgIcon}>
        <Typography component="div">
          {Icon ? <Icon /> : <LanguageIcon />}
        </Typography>
      </Box>
      <Box flexGrow="1">
        <Link to={href} target="_blank" rel="noopener">
          {text || href}
        </Link>
      </Box>
    </Box>
  );
};
