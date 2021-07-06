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
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BuildStepAction } from 'circleci-api';
import React, { Suspense, useEffect, useState } from 'react';
import { durationHumanized } from '../../../../util';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));
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

export const ActionOutput = ({
  url,
  name,
  className,
  action,
}: {
  url: string;
  name: string;
  className?: string;
  action: BuildStepAction;
}) => {
  const classes = useStyles();

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(actionOutput => {
        if (typeof actionOutput !== 'undefined') {
          setMessages(
            actionOutput.map(({ message }: { message: string }) => message),
          );
        }
      });
  }, [url]);

  const timeElapsed = durationHumanized(action.start_time, action.end_time);

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
        <Typography variant="button">
          {name} ({timeElapsed})
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        {messages.length === 0 ? (
          'Nothing here...'
        ) : (
          <Suspense fallback={<LinearProgress />}>
            <div style={{ height: '20vh', width: '100%' }}>
              <LazyLog text={messages.join('\n')} extraLines={1} enableSearch />
            </div>
          </Suspense>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
