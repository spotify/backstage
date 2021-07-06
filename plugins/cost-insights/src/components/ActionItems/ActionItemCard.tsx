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
import React, { MouseEventHandler } from 'react';
import classnames from 'classnames';
import { Card, CardHeader } from '@material-ui/core';
import { useScroll } from '../../hooks';
import { Alert } from '../../types';
import { useActionItemCardStyles as useStyles } from '../../utils/styles';

type ActionItemCardProps = {
  alert: Alert;
  number?: number;
  avatar?: JSX.Element;
  disableScroll?: boolean;
};

export const ActionItemCard = ({
  alert,
  avatar,
  number,
  disableScroll = false,
}: ActionItemCardProps) => {
  const classes = useStyles();
  const rootClasses = classnames(classes.root, {
    [classes.activeRoot]: !disableScroll,
  });
  const [, setScroll] = useScroll();

  const onActionItemClick: MouseEventHandler = () => {
    if (!disableScroll && number) {
      setScroll(`alert-${number}`);
    }
  };

  return (
    <Card className={classes.card} raised={false} onClick={onActionItemClick}>
      <CardHeader
        classes={{
          root: rootClasses,
          action: classes.action,
          title: classes.title,
        }}
        title={alert.title}
        subheader={alert.subtitle}
        avatar={avatar}
      />
    </Card>
  );
};
