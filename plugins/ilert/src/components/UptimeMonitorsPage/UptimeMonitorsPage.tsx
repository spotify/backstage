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
import { AuthenticationError } from '@backstage/errors';
import { UptimeMonitorsTable } from './UptimeMonitorsTable';
import { MissingAuthorizationHeaderError } from '../Errors';
import { useUptimeMonitors } from '../../hooks/useUptimeMonitors';
import {
  Content,
  ContentHeader,
  SupportButton,
  ResponseErrorPanel,
} from '@backstage/core-components';

export const UptimeMonitorsPage = () => {
  const [
    { tableState, uptimeMonitors, isLoading, error },
    { onChangePage, onChangeRowsPerPage, onUptimeMonitorChanged },
  ] = useUptimeMonitors();

  if (error) {
    if (error instanceof AuthenticationError) {
      return (
        <Content>
          <MissingAuthorizationHeaderError />
        </Content>
      );
    }

    return (
      <Content>
        <ResponseErrorPanel error={error} />
      </Content>
    );
  }

  return (
    <Content>
      <ContentHeader title="Uptime Monitors">
        <SupportButton>
          This helps you to bring iLert into your developer portal.
        </SupportButton>
      </ContentHeader>
      <UptimeMonitorsTable
        uptimeMonitors={uptimeMonitors}
        tableState={tableState}
        isLoading={isLoading}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onUptimeMonitorChanged={onUptimeMonitorChanged}
      />
    </Content>
  );
};
