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

import React, { PropsWithChildren } from 'react';
import { DialogContent, List } from '@material-ui/core';
import { ResponseStep } from '../../types/types';

import { ResponseStepListItem } from './ResponseStepListItem';
import { TEST_IDS } from '../../test-helpers/test-ids';
import { Progress } from '@backstage/core-components';

interface ResponseStepListProps {
  responseSteps: (ResponseStep | undefined)[];
  animationDelay?: number;
  loading?: boolean;
  closeable?: boolean;
  denseList?: boolean;
}

export const ResponseStepList = ({
  responseSteps,
  animationDelay,
  loading = false,
  denseList = false,
  children,
}: PropsWithChildren<ResponseStepListProps>) => {
  return (
    <>
      {loading || responseSteps.length === 0 ? (
        <div
          data-testid={TEST_IDS.components.circularProgress}
          style={{
            textAlign: 'center',
            margin: 10,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Progress />
        </div>
      ) : (
        <>
          <DialogContent
            data-testid={TEST_IDS.components.responseStepListDialogContent}
          >
            <List dense={denseList}>
              {responseSteps.map((responseStep, index) => {
                if (!responseStep) {
                  return null;
                }

                return (
                  <ResponseStepListItem
                    key={`ResponseStepListItem-${index}`}
                    responseStep={responseStep}
                    index={index}
                    animationDelay={animationDelay}
                  />
                );
              })}
            </List>

            {children}
          </DialogContent>
        </>
      )}
    </>
  );
};
