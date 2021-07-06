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
import { IncidentsPage } from '../IncidentsPage';
import { UptimeMonitorsPage } from '../UptimeMonitorsPage';
import { OnCallSchedulesPage } from '../OnCallSchedulesPage';
import {
  Page,
  Header,
  HeaderTabs,
  HeaderLabel,
  Content,
} from '@backstage/core-components';

export const ILertPage = () => {
  const [selectedTab, setSelectedTab] = React.useState<number>(0);
  const tabs = [
    { label: 'Who is on call?' },
    { label: 'Incidents' },
    { label: 'Uptime Monitors' },
  ];
  const renderTab = () => {
    switch (selectedTab) {
      case 0:
        return <OnCallSchedulesPage />;
      case 1:
        return <IncidentsPage />;
      case 2:
        return <UptimeMonitorsPage />;
      default:
        return null;
    }
  };

  return (
    <Page themeId="website">
      <Header title="iLert" type="tool">
        <HeaderLabel label="Owner" value="iLert" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabs.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />

      <Content noPadding>{renderTab()}</Content>
    </Page>
  );
};

export default ILertPage;
