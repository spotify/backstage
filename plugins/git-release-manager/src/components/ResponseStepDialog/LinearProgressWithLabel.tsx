/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { Box, LinearProgress, Typography } from '@material-ui/core';

import { ResponseStep } from '../../types/types';
import { TEST_IDS } from '../../test-helpers/test-ids';

const STATUSES = {
  FAILURE: 'FAILURE',
  ONGOING: 'ONGOING',
  SUCCESS: 'SUCCESS',
} as const;

const ICONS = {
  SUCCESS: '🚀',
  FAILURE: '🔥',
};

const getFontSize = (progress: number) => 125 + Math.ceil(progress / Math.PI);

export function LinearProgressWithLabel(props: {
  progress: number;
  responseSteps: ResponseStep[];
}) {
  const roundedValue = Math.ceil(props.progress);
  const progress = roundedValue < 100 ? roundedValue : 100;

  const failure = props.responseSteps.some(
    responseStep => responseStep.icon === 'failure',
  );

  let status: keyof typeof STATUSES = STATUSES.ONGOING;
  if (!failure && progress === 100) status = STATUSES.SUCCESS;
  if (failure) status = STATUSES.FAILURE;

  const CompletionEmoji = () => {
    if (status === STATUSES.ONGOING) return null;
    if (status === STATUSES.FAILURE) return <span>{` ${ICONS.FAILURE} `}</span>;
    return <span>{` ${ICONS.SUCCESS} `}</span>;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="90%"
      alignSelf="center"
      flexDirection="column"
    >
      <Box width="100%">
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Box>
        <Typography
          variant="body2"
          data-testid={TEST_IDS.components.linearProgressWithLabel}
          style={{
            marginTop: 8,
            minWidth: 35,
            color: failure ? '#ff0033' : '#1DB954',
            fontWeight: 'bold',
            fontSize: `${getFontSize(progress)}%`,
            transition: 'font-size 250ms ease',
          }}
        >
          <CompletionEmoji />
          {`${progress}%`}
          <CompletionEmoji />
        </Typography>
      </Box>
    </Box>
  );
}

export const testables = {
  ICONS,
};
