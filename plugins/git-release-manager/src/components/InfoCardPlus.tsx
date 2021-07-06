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
import { makeStyles } from '@material-ui/core';
import { TEST_IDS } from '../test-helpers/test-ids';

import { InfoCard } from '@backstage/core-components';

const useStyles = makeStyles(() => ({
  feature: {
    marginBottom: '3em',
  },
}));

export const InfoCardPlus = ({ children }: { children?: React.ReactNode }) => {
  const classes = useStyles();

  return (
    <div
      style={{ position: 'relative' }}
      data-testid={TEST_IDS.info.infoFeaturePlus}
    >
      <InfoCard className={classes.feature}>{children}</InfoCard>
    </div>
  );
};
