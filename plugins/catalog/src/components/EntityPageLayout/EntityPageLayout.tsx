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
import {
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import {
  EntityContext,
  EntityRefLinks,
  getEntityRelations,
  useEntityCompoundName,
} from '@backstage/plugin-catalog-react';
import { Box } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';
import { FavouriteEntity } from '../FavouriteEntity/FavouriteEntity';
import { UnregisterEntityDialog } from '../UnregisterEntityDialog/UnregisterEntityDialog';
import { Tabbed } from './Tabbed';

import {
  Content,
  Header,
  HeaderLabel,
  Link,
  Page,
  Progress,
  ResponseErrorPanel,
  WarningPanel,
} from '@backstage/core-components';

import { IconComponent } from '@backstage/core-plugin-api';

const EntityPageTitle = ({
  entity,
  title,
}: {
  title: string;
  entity: Entity | undefined;
}) => (
  <Box display="inline-flex" alignItems="center" height="1em">
    {title}
    {entity && <FavouriteEntity entity={entity} />}
  </Box>
);

const EntityLabels = ({ entity }: { entity: Entity }) => {
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  return (
    <>
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              entityRefs={ownedByRelations}
              defaultKind="Group"
              color="inherit"
            />
          }
        />
      )}
      {entity.spec?.lifecycle && (
        <HeaderLabel label="Lifecycle" value={entity.spec.lifecycle} />
      )}
    </>
  );
};

const headerProps = (
  kind: string,
  namespace: string | undefined,
  name: string,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } => {
  return {
    headerTitle: `${name}${
      namespace && namespace !== ENTITY_DEFAULT_NAMESPACE
        ? ` in ${namespace}`
        : ''
    }`,
    headerType: (() => {
      let t = kind.toLocaleLowerCase('en-US');
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLocaleLowerCase('en-US');
      }
      return t;
    })(),
  };
};

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
type ExtraContextMenuItem = {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
};

type EntityPageLayoutProps = {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  children?: React.ReactNode;
};

export const EntityPageLayout = ({
  children,
  UNSTABLE_extraContextMenuItems,
}: EntityPageLayoutProps) => {
  const { kind, namespace, name } = useEntityCompoundName();
  const { entity, loading, error } = useContext(EntityContext);
  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity!,
  );

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();
  const cleanUpAfterRemoval = async () => {
    setConfirmationDialogOpen(false);
    navigate('/');
  };

  const showRemovalDialog = () => setConfirmationDialogOpen(true);

  return (
    <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
      <Header
        title={<EntityPageTitle title={headerTitle} entity={entity!} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
        {/* TODO: Make entity labels configurable for entity kind / type */}
        {entity && (
          <>
            <EntityLabels entity={entity} />
            <EntityContextMenu
              UNSTABLE_extraContextMenuItems={UNSTABLE_extraContextMenuItems}
              onUnregisterEntity={showRemovalDialog}
            />
          </>
        )}
      </Header>

      {loading && (
        <Content>
          <Progress />
        </Content>
      )}

      {entity && <Tabbed.Layout>{children}</Tabbed.Layout>}

      {error && (
        <Content>
          <ResponseErrorPanel error={error} />
        </Content>
      )}

      {!loading && !error && !entity && (
        <Content>
          <WarningPanel title="Entity not found">
            There is no {kind} with the requested{' '}
            <Link to="https://backstage.io/docs/features/software-catalog/references">
              kind, namespace, and name
            </Link>
            .
          </WarningPanel>
        </Content>
      )}

      <UnregisterEntityDialog
        open={confirmationDialogOpen}
        entity={entity!}
        onConfirm={cleanUpAfterRemoval}
        onClose={() => setConfirmationDialogOpen(false)}
      />
    </Page>
  );
};

EntityPageLayout.Content = Tabbed.Content;
