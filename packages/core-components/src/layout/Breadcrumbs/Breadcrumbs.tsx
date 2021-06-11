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
  Box,
  Breadcrumbs as MaterialBreadcrumbs,
  List,
  ListItem,
  Popover,
  Typography,
  withStyles,
} from '@material-ui/core';
import React, { ComponentProps, Fragment } from 'react';

type Props = ComponentProps<typeof MaterialBreadcrumbs>;

const ClickableText = withStyles({
  root: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
})(Typography);

const StyledBox = withStyles({
  root: {
    textDecoration: 'underline',
    color: 'inherit',
  },
})(Box);

export const Breadcrumbs = ({ children, ...props }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const childrenArray = React.Children.toArray(children);

  const [firstPage, secondPage, ...expandablePages] = childrenArray;
  const currentPage = expandablePages.length
    ? expandablePages.pop()
    : childrenArray[childrenArray.length - 1];
  const hasHiddenBreadcrumbs = childrenArray.length > 3;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Fragment>
      <MaterialBreadcrumbs aria-label="breadcrumb" {...props}>
        {childrenArray.length > 1 && <StyledBox clone>{firstPage}</StyledBox>}
        {childrenArray.length > 2 && <StyledBox clone>{secondPage}</StyledBox>}
        {hasHiddenBreadcrumbs && (
          <ClickableText onClick={handleClick}>...</ClickableText>
        )}
        <Box style={{ fontStyle: 'italic' }}>{currentPage}</Box>
      </MaterialBreadcrumbs>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
          {expandablePages.map((pageLink, index) => (
            <ListItem key={index} button>
              <StyledBox clone>{pageLink}</StyledBox>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Fragment>
  );
};
