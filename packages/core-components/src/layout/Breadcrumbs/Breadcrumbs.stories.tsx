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
import { Box, List, ListItem, Popover, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Fragment } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from '../../components/Link';
import { Header } from '../Header';
import { Page } from '../Page';
import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'Layout/Breadcrumbs',
  component: Breadcrumbs,
};

export const InHeader = () => (
  <MemoryRouter>
    <h2>Standard breadcrumbs</h2>
    <p>
      Underlined pages are links. This should show a hierarchical relationship.
    </p>

    <Page themeId="other">
      <Header title="Current Page" type="General Page" typeLink="/" />
    </Page>
  </MemoryRouter>
);

export const OutsideOfHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(
    null,
  );
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <MemoryRouter>
      <p>
        It might be the case that you want to keep your breadcrumbs outside of
        the header. In that case, they should be positioned above the title of
        the page.
      </p>

      <h2>Standard breadcrumbs</h2>
      <p>
        Underlined pages are links. This should show a hierarchical
        relationship.
      </p>

      <Breadcrumbs color="primaryText" />

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Hidden breadcrumbs</h2>
      <p>
        Use this when you have more than three breadcrumbs. When user clicks on
        ellipses, expand the breadcrumbs out.
      </p>

      <Breadcrumbs color="primaryText">
        <Link to="/">General Page</Link>
        <Link to="/">Second Page</Link>
        <Link to="/">Third Page</Link>
        <Link to="/">Fourth Page</Link>
        <Typography>Current page</Typography>
      </Breadcrumbs>

      <h2>Layered breadcrumbs</h2>
      <p>
        Use this when you want to show alternative breadcrumbs on the same
        hierarchical level.
      </p>

      <Fragment>
        <Breadcrumbs color="primaryText">
          <Link to="/">General Page</Link>
          <Link to="/" onClick={handleClick}>
            <Box display="flex" alignItems="center">
              <span>Second Page</span>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Link>
          <Typography>Current page</Typography>
        </Breadcrumbs>
        <Popover
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List>
            <ListItem button style={{ textDecoration: 'underline' }}>
              Parallel second page
            </ListItem>
            <ListItem button style={{ textDecoration: 'underline' }}>
              Another parallel second page
            </ListItem>
            <ListItem button style={{ textDecoration: 'underline' }}>
              Yet another, parallel second page
            </ListItem>
          </List>
        </Popover>
      </Fragment>
    </MemoryRouter>
  );
};
