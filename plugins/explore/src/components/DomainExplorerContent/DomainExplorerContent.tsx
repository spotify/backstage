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
import { DomainEntity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button } from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { DomainCard } from '../DomainCard';

import {
  Content,
  ContentHeader,
  EmptyState,
  ItemCardGrid,
  Progress,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';

import { useApi } from '@backstage/core-plugin-api';

const Body = () => {
  const catalogApi = useApi(catalogApiRef);
  const { value: entities, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: 'domain' },
    });
    return response.items as DomainEntity[];
  }, [catalogApi]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <WarningPanel severity="error" title="Could not load domains.">
        {error.message}
      </WarningPanel>
    );
  }

  if (!entities?.length) {
    return (
      <EmptyState
        missing="info"
        title="No domains to display"
        description="You haven't added any domains yet."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/descriptor-format#kind-domain"
          >
            Read more
          </Button>
        }
      />
    );
  }

  return (
    <ItemCardGrid>
      {entities.map((entity, index) => (
        <DomainCard key={index} entity={entity} />
      ))}
    </ItemCardGrid>
  );
};

type DomainExplorerContentProps = {
  title?: string;
};

export const DomainExplorerContent = ({
  title,
}: DomainExplorerContentProps) => {
  return (
    <Content noPadding>
      <ContentHeader title={title ?? 'Domains'}>
        <SupportButton>Discover the domains in your ecosystem.</SupportButton>
      </ContentHeader>
      <Body />
    </Content>
  );
};
