/*
 * Copyright 2021 Spotify AB
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

import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { makeStyles } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';
import { catalogApiRef, CatalogApi } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import {
  CodeSnippet,
  Content,
  ConfigApi,
  configApiRef,
  Header,
  HeaderTabs,
  Page,
  Progress,
  useApi,
  WarningPanel,
  SupportButton,
  ContentHeader,
} from '@backstage/core';
import { DocsTable } from './DocsTable';
import { DocsCardGrid } from './DocsCardGrid';

const panels = {
  DocsTable: DocsTable,
  DocsCardGrid: DocsCardGrid,
};

export type PanelType = 'DocsCardGrid' | 'DocsTable';

export interface PanelConfig {
  title: string;
  description: string;
  panelType: PanelType;
  panelCSS?: CSSProperties;
  filterPredicate: (entity: Entity) => boolean;
}

export interface TabConfig {
  label: string;
  panels: PanelConfig[];
}

export type TabsConfig = TabConfig[];

const CustomPanel = ({
  config,
  entities,
  index,
}: {
  config: PanelConfig;
  entities: Entity[];
  index: number;
}) => {
  const useStyles = makeStyles({
    panelContainer: {
      marginBottom: '2rem',
      ...(config.panelCSS ? config.panelCSS : {}),
    },
  });
  const classes = useStyles();
  const Panel = panels[config.panelType];
  const shownEntities = entities.filter(config.filterPredicate);
  return (
    <>
      <ContentHeader title={config.title} description={config.description}>
        {index === 0 ? (
          <SupportButton>
            Discover documentation in your ecosystem.
          </SupportButton>
        ) : null}
      </ContentHeader>
      <div className={classes.panelContainer}>
        <Panel entities={shownEntities} />
      </div>
    </>
  );
};

export const TechDocsCustomHome = ({
  tabsConfig,
}: {
  tabsConfig: TabsConfig;
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const catalogApi: CatalogApi = useApi(catalogApiRef);
  const configApi: ConfigApi = useApi(configApiRef);

  const { value: entities, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities();
    return response.items.filter((entity: Entity) => {
      return !!entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    });
  });

  const generatedSubtitle = `Documentation available in ${
    configApi.getOptionalString('organization.name') ?? 'Backstage'
  }`;

  const currentTabConfig = tabsConfig[selectedTab];

  if (loading) {
    return (
      <Page themeId="documentation">
        <Header title="Documentation" subtitle={generatedSubtitle} />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="documentation">
        <Header title="Documentation" subtitle={generatedSubtitle} />
        <Content>
          <WarningPanel
            severity="error"
            title="Could not load available documentation."
          >
            <CodeSnippet language="text" text={error.toString()} />
          </WarningPanel>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="documentation">
      <Header title="Documentation" subtitle={generatedSubtitle} />
      <HeaderTabs
        selectedIndex={selectedTab}
        onChange={index => setSelectedTab(index)}
        tabs={tabsConfig.map(({ label }, index) => ({
          id: index.toString(),
          label,
        }))}
      />
      <Content>
        {currentTabConfig.panels.map((config, index) => (
          <CustomPanel
            key={index}
            config={config}
            entities={!!entities ? entities : []}
            index={index}
          />
        ))}
      </Content>
    </Page>
  );
};
