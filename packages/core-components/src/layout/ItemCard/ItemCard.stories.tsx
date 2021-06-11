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

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Button } from '../../components';
import { ItemCardGrid } from './ItemCardGrid';
import { ItemCardHeader } from './ItemCardHeader';

export default {
  title: 'Layout/Item Cards',
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const useStyles = makeStyles({
  grid: {
    gridTemplateColumns: 'repeat(auto-fill, 12em)',
  },
  header: {
    color: 'black',
    backgroundImage: 'linear-gradient(to bottom right, red, yellow)',
  },
});

export const Default = () => (
  <MemoryRouter>
    <Typography paragraph>
      The most basic setup is to place a bunch of cards into a large grid,
      leaving styling to the defaults. Try to resize the window to see how they
      rearrange themselves to fit the viewport.
    </Typography>
    <ItemCardGrid>
      {[...Array(10).keys()].map(index => (
        <Card key={index}>
          <CardMedia>
            <ItemCardHeader title={`Card #${index}`} subtitle="Subtitle" />
          </CardMedia>
          <CardContent>
            {text
              .split(' ')
              .slice(0, 5 + Math.floor(Math.random() * 30))
              .join(' ')}
          </CardContent>
          <CardActions>
            <Button color="primary" to="/catalog">
              Go There!
            </Button>
          </CardActions>
        </Card>
      ))}
    </ItemCardGrid>
  </MemoryRouter>
);

export const Styling = () => {
  const classes = useStyles();
  return (
    <MemoryRouter>
      <Typography paragraph>
        Both the grid and the header can be styled, using the{' '}
        <Typography variant="caption">classes</Typography> property. This lets
        you for example tweak the column sizes and the background of the header.
      </Typography>
      <ItemCardGrid classes={{ root: classes.grid }}>
        {[...Array(10).keys()].map(index => (
          <Card key={index}>
            <CardMedia>
              <ItemCardHeader
                title={`Card #${index}`}
                subtitle="Subtitle"
                classes={{ root: classes.header }}
              />
            </CardMedia>
            <CardContent>
              {text
                .split(' ')
                .slice(0, 5 + Math.floor(Math.random() * 30))
                .join(' ')}
            </CardContent>
            <CardActions>
              <Button color="primary" to="/catalog">
                Go There!
              </Button>
            </CardActions>
          </Card>
        ))}
      </ItemCardGrid>
    </MemoryRouter>
  );
};
