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

import { Button, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import React, { ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync, useLocalStorage } from 'react-use';
import { lighthouseApiRef } from '../../api';
import { useQuery } from '../../utils';
import LighthouseIntro, { LIGHTHOUSE_INTRO_LOCAL_STORAGE } from '../Intro';
import LighthouseSupportButton from '../SupportButton';
import AuditListTable from './AuditListTable';

import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  InfoCard,
  Page,
  Progress,
  WarningPanel,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

// TODO(freben): move all of this out of index

export const LIMIT = 10;

const AuditList = () => {
  const [dismissedStored] = useLocalStorage(LIGHTHOUSE_INTRO_LOCAL_STORAGE);
  const [dismissed, setDismissed] = useState(dismissedStored);

  const query = useQuery();
  const page = query.get('page')
    ? parseInt(query.get('page') as string, 10) || 1
    : 1;

  const lighthouseApi = useApi(lighthouseApiRef);
  const { value, loading, error } = useAsync(
    async () =>
      await lighthouseApi.getWebsiteList({
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      }),
    [page],
  );

  const pageCount: number = useMemo(() => {
    if (value?.total && value?.limit)
      return Math.ceil(value?.total / value?.limit);
    return 0;
  }, [value?.total, value?.limit]);

  const navigate = useNavigate();

  let content: ReactNode = null;
  if (value) {
    content = (
      <>
        <AuditListTable items={value?.items || []} />
        {pageCount > 1 && (
          <Pagination
            page={page}
            count={pageCount}
            onChange={(_event: Event, newPage: number) => {
              navigate(`?page=${newPage}`);
            }}
          />
        )}
      </>
    );
  } else if (loading) {
    content = <Progress />;
  } else if (error) {
    content = (
      <WarningPanel severity="error" title="Could not load audit list.">
        {error.message}
      </WarningPanel>
    );
  }

  return (
    <Page themeId="tool">
      <Header
        title="Lighthouse"
        subtitle="Website audits powered by Lighthouse"
      >
        <HeaderLabel label="Owner" value="Spotify" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <LighthouseIntro onDismiss={() => setDismissed(true)} />
        <ContentHeader
          title="Audits"
          description="View all audits run for your website through Backstage here. Track the trend of your most recent audits."
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('create-audit')}
          >
            Create Audit
          </Button>
          {dismissed && <LighthouseSupportButton />}
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard noPadding>{content}</InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default AuditList;
