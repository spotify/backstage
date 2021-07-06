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
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';

import { TEST_IDS } from '../test-helpers/test-ids';

export const NoLatestRelease = () => {
  return (
    <Box marginBottom={2}>
      <Alert
        data-testid={TEST_IDS.components.noLatestRelease}
        severity="warning"
      >
        Unable to find any Release
      </Alert>
    </Box>
  );
};
