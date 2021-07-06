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
import {
  Drawer,
  Button,
  Typography,
  makeStyles,
  IconButton,
  createStyles,
  Theme,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';

export default {
  title: 'Layout/Drawer',
  component: Drawer,
};

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      justifyContent: 'space-between',
      padding: theme.spacing(2.5),
    },
  }),
);

const useDrawerContentStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      height: '80%',
      backgroundColor: '#EEEEEE',
    },
    secondaryAction: {
      marginLeft: theme.spacing(2.5),
    },
  }),
);

/* Example content wrapped inside the Drawer component */
const DrawerContent = ({
  toggleDrawer,
}: {
  toggleDrawer: (isOpen: boolean) => void;
}) => {
  const classes = useDrawerContentStyles();

  return (
    <>
      <div className={classes.header}>
        <Typography variant="h5">Side Panel Title</Typography>
        <IconButton
          key="dismiss"
          title="Close the drawer"
          onClick={() => toggleDrawer(false)}
          color="inherit"
        >
          <Close className={classes.icon} />
        </IconButton>
      </div>
      <div className={classes.content} />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => toggleDrawer(false)}
        >
          Primary Action
        </Button>
        <Button
          className={classes.secondaryAction}
          variant="outlined"
          color="primary"
          onClick={() => toggleDrawer(false)}
        >
          Secondary Action
        </Button>
      </div>
    </>
  );
};

/* Default drawer can toggle open or closed.
 * It can be cancelled by clicking the overlay
 * or pressing the esc key.
 */
export const DefaultDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => toggleDrawer(true)}
      >
        Open Default Drawer
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};

/* Persistent drawer works like the default one -
 * except that the content sits on the same level
 * as the main content and you can't cancel it by
 * clicking the overlay or pressing the esc key.
 *
 * Set the Drawer variant props: 'persistent'
 */
export const PersistentDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => toggleDrawer(true)}
      >
        Open Persistent Drawer
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        variant="persistent"
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};
