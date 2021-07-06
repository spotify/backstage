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
import { Website, lighthouseApiRef } from '../../api';
import { useInterval } from 'react-use';
import {
  formatTime,
  CATEGORIES,
  CATEGORY_LABELS,
  buildSparklinesDataForItem,
} from '../../utils';
import { Link, generatePath } from 'react-router-dom';
import AuditStatusIcon from '../AuditStatusIcon';

import { Table, TableColumn, TrendLine } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const columns: TableColumn[] = [
  {
    title: 'Website URL',
    field: 'websiteUrl',
  },
  ...CATEGORIES.map(category => ({
    title: CATEGORY_LABELS[category],
    field: category,
  })),
  {
    title: 'Last Report',
    field: 'lastReport',
    cellStyle: {
      whiteSpace: 'nowrap',
    },
  },
  {
    title: 'Last Audit Triggered',
    field: 'lastAuditTriggered',
    cellStyle: {
      minWidth: 120,
    },
  },
];

export const AuditListTable = ({ items }: { items: Website[] }) => {
  const [websiteState, setWebsiteState] = useState(items);
  const lighthouseApi = useApi(lighthouseApiRef);

  useEffect(() => {
    setWebsiteState(items);
  }, [items]);

  const runRefresh = (websites: Website[]) => {
    websites.forEach(async website => {
      const response = await lighthouseApi.getWebsiteForAuditId(
        website.lastAudit.id,
      );
      const auditStatus = response.lastAudit.status;
      if (auditStatus === 'COMPLETED' || auditStatus === 'FAILED') {
        const newWebsiteData = websiteState.slice(0);
        newWebsiteData[
          newWebsiteData.findIndex(w => w.url === response.url)
        ] = response;
        setWebsiteState(newWebsiteData);
      }
    });
  };

  const runningWebsiteAudits = websiteState
    ? websiteState.filter(website => website.lastAudit.status === 'RUNNING')
    : [];

  useInterval(
    () => runRefresh(runningWebsiteAudits),
    runningWebsiteAudits.length > 0 ? 5000 : null,
  );

  const data = websiteState.map(website => {
    const trendlineData = buildSparklinesDataForItem(website);
    const trendlines: any = {};
    CATEGORIES.forEach(category => {
      trendlines[category] = (
        <TrendLine
          title={`trendline for ${CATEGORY_LABELS[category]} category of ${website.url}`}
          data={trendlineData[category] || []}
        />
      );
    });

    return {
      websiteUrl: (
        <Link to={generatePath('audit/:id', { id: website.lastAudit.id })}>
          {website.url}
        </Link>
      ),
      ...trendlines,
      lastReport: (
        <>
          <AuditStatusIcon audit={website.lastAudit} />{' '}
          <span>{website.lastAudit.status.toLocaleUpperCase('en-US')}</span>
        </>
      ),
      lastAuditTriggered: formatTime(website.lastAudit.timeCreated),
    };
  });

  return (
    <Table
      options={{
        paging: false,
        toolbar: false,
      }}
      columns={columns}
      data={data}
    />
  );
};

export default AuditListTable;
