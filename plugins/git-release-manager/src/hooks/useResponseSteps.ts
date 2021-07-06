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

import { useState } from 'react';

import { ResponseStep } from '../types/types';

const RESPONSE_STEP_FAILURE_ABORT: ResponseStep = {
  message: 'Skipped due to error in previous step',
  icon: 'failure',
};

export function useResponseSteps() {
  const [responseSteps, setResponseSteps] = useState<ResponseStep[]>([]);

  const addStepToResponseSteps = (responseStep: ResponseStep) => {
    setResponseSteps([...responseSteps, responseStep]);
  };

  const asyncCatcher = (error: Error): never => {
    const responseStepError: ResponseStep = {
      message: 'Something went wrong 🔥',
      secondaryMessage: `Error message: ${
        error?.message ? error.message : 'unknown'
      }`,
      icon: 'failure',
    };

    addStepToResponseSteps(responseStepError);
    throw error;
  };

  const abortIfError = (error?: Error) => {
    if (error) {
      addStepToResponseSteps(RESPONSE_STEP_FAILURE_ABORT);
      throw error;
    }
  };

  return {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  };
}
