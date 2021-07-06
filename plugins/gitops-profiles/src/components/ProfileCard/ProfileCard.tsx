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
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  IconButton,
  Theme,
  Typography,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: green[500],
    },
  }),
);

interface Props {
  shortName: string;
  title: string;
  repository: string;
  description: string;
  index: number;
  onClick: (i: number, repository: string) => void;
  selections: Set<number>;
}

const ProfileCard = (props: Props) => {
  const [selection, setSelection] = useState(false);

  const handleSelect = () => {
    props.onClick(props.index, props.repository);
    setSelection(props.selections.has(props.index));
  };

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {props.shortName}
          </Avatar>
        }
        action={<IconButton aria-label="settings" />}
        title={props.title}
        subheader={props.repository.replace('https://github.com/', '')}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="select" onClick={handleSelect}>
          {selection ? (
            <CheckBoxIcon color="primary" />
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
