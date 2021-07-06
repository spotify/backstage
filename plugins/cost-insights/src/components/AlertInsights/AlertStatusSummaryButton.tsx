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

import React, { useState, MouseEventHandler, PropsWithChildren } from 'react';
import classnames from 'classnames';
import { Button } from '@material-ui/core';
import { default as ExpandMoreIcon } from '@material-ui/icons/ExpandMore';
import { useAlertStatusSummaryButtonStyles as useStyles } from '../../utils/styles';

type AlertStatusSummaryButtonProps = {
  onClick: MouseEventHandler;
};

export const AlertStatusSummaryButton = ({
  children,
  onClick,
}: PropsWithChildren<AlertStatusSummaryButtonProps>) => {
  const classes = useStyles();
  const [clicked, setClicked] = useState(false);
  const iconClassName = classnames(classes.icon, {
    [classes.clicked]: clicked,
  });

  const handleOnClick: MouseEventHandler = e => {
    setClicked(prevClicked => !prevClicked);
    onClick(e);
  };

  return (
    <Button
      variant="text"
      color="primary"
      disableElevation
      aria-label="expand"
      endIcon={<ExpandMoreIcon className={iconClassName} />}
      onClick={handleOnClick}
    >
      {children}
    </Button>
  );
};
