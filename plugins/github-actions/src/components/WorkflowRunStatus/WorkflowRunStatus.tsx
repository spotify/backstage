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

import React from 'react';
import {
  StatusPending,
  StatusRunning,
  StatusOK,
  StatusWarning,
  StatusAborted,
  StatusError,
} from '@backstage/core-components';

export const WorkflowRunStatus = ({
  status,
  conclusion,
}: {
  status: string | undefined;
  conclusion: string | undefined;
}) => {
  if (status === undefined) return null;
  switch (status.toLocaleLowerCase('en-US')) {
    case 'queued':
      return (
        <>
          <StatusPending /> Queued
        </>
      );
    case 'in_progress':
      return (
        <>
          <StatusRunning /> In progress
        </>
      );
    case 'completed':
      switch (conclusion?.toLocaleLowerCase('en-US')) {
        case 'skipped' || 'canceled':
          return (
            <>
              <StatusAborted /> Aborted
            </>
          );
        case 'timed_out':
          return (
            <>
              <StatusWarning /> Timed out
            </>
          );
        case 'failure':
          return (
            <>
              <StatusError /> Error
            </>
          );
        default:
          return (
            <>
              <StatusOK /> Completed
            </>
          );
      }
    default:
      return (
        <>
          <StatusPending /> Pending
        </>
      );
  }
};
