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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect } from 'react';

const useStyles = makeStyles({
  accordionDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
});

type ActionOutputProps = {
  url: string;
  name: string;
  className?: string;
  action: any;
};

export const ActionOutput = ({ url, name, className }: ActionOutputProps) => {
  const classes = useStyles();

  useEffect(() => {}, [url]);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} className={className}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">{name}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        Nothing here...
      </AccordionDetails>
    </Accordion>
  );
};
