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

import React, { useState, useEffect } from 'react';
import { useMountedState } from 'react-use';
import { Typography } from '@material-ui/core';
import { Progress } from '@backstage/core-components';

const TechDocsProgressBar = () => {
  const isMounted = useMountedState();
  const [hasBeenDelayed, setHasBeenDelayed] = useState(false);

  const delayReason = `Docs are still loading...Backstage takes some extra time to load docs
  for the first time. The subsequent loads are much faster.`;

  // Allowed time that docs can take to load (in milliseconds)
  const allowedDelayTime = 5000;

  useEffect(() => {
    setTimeout(() => {
      if (isMounted()) {
        setHasBeenDelayed(true);
      }
    }, allowedDelayTime);
  });

  return (
    <>
      {hasBeenDelayed ? (
        <Typography data-testid="delay-reason">{delayReason}</Typography>
      ) : null}
      <Progress />
    </>
  );
};

export default TechDocsProgressBar;
