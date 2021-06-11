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

import { HelpIcon, useApp } from '@backstage/core-api';
import {
  Button,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
} from '@material-ui/core';
import React, {
  Fragment,
  MouseEventHandler,
  PropsWithChildren,
  useState,
} from 'react';
import { SupportItem, SupportItemLink, useSupportConfig } from '../../hooks';
import { Link } from '../Link';

type Props = {};

const useStyles = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  popoverList: {
    minWidth: 260,
    maxWidth: 400,
  },
}));

const SupportIcon = ({ icon }: { icon: string | undefined }) => {
  const app = useApp();
  const Icon = icon ? app.getSystemIcon(icon) ?? HelpIcon : HelpIcon;
  return <Icon />;
};

const SupportLink = ({ link }: { link: SupportItemLink }) => (
  <Link to={link.url} target="_blank" rel="noreferrer noopener">
    {link.title ?? link.url}
  </Link>
);

const SupportListItem = ({ item }: { item: SupportItem }) => {
  return (
    <ListItem>
      <ListItemIcon>
        <SupportIcon icon={item.icon} />
      </ListItemIcon>
      <ListItemText
        primary={item.title}
        secondary={item.links?.reduce<React.ReactNodeArray>(
          (prev, link, idx) => [
            ...prev,
            idx > 0 && <br key={idx} />,
            <SupportLink link={link} key={link.url} />,
          ],
          [],
        )}
      />
    </ListItem>
  );
};

export const SupportButton = ({ children }: PropsWithChildren<Props>) => {
  const { items } = useSupportConfig();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const classes = useStyles();

  const onClickHandler: MouseEventHandler = event => {
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const popoverCloseHandler = () => {
    setPopoverOpen(false);
  };

  return (
    <Fragment>
      <Button
        data-testid="support-button"
        color="primary"
        onClick={onClickHandler}
      >
        <HelpIcon className={classes.leftIcon} />
        Support
      </Button>
      <Popover
        data-testid="support-button-popover"
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={popoverCloseHandler}
      >
        <List className={classes.popoverList}>
          {React.Children.map(children, (child, i) => (
            <ListItem alignItems="flex-start" key={i}>
              {child}
            </ListItem>
          ))}
          {items &&
            items.map((item, i) => <SupportListItem item={item} key={i} />)}
        </List>
        <DialogActions>
          <Button color="primary" onClick={popoverCloseHandler}>
            Close
          </Button>
        </DialogActions>
      </Popover>
    </Fragment>
  );
};
