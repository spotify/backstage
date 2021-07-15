/*
 * Copyright 2021 Spotify AB
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
import { Link } from '@backstage/core-components';
import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

export const StackOverflowResultListItem = ({ result }: any) => {
  const classes = useStyles();
  return (
    <Link to={result.location} target="_blank">
      <ListItem alignItems="flex-start" className={classes.flexContainer}>
        <ListItemText
          className={classes.itemText}
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={`Author: ${result.text}`}
        />
        <Box>
          <Chip label={`Answer(s): ${result.answers}`} size="small" />
          {result.tags &&
            result.tags.map((tag: string) => (
              <Chip label={`Tag: ${tag}`} size="small" />
            ))}
        </Box>
      </ListItem>
      <Divider component="li" />
    </Link>
  );
};
