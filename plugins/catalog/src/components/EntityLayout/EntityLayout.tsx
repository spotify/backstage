/*
 * Copyright 2020 Spotify AB
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
  attachComponentData,
  Content,
  Header,
  HeaderLabel,
  IconComponent,
  Page,
  Progress,
  RoutedTabs,
} from '@backstage/core';
import {
  EntityContext,
  EntityRefLinks,
  getEntityRelations,
  useEntityCompoundName,
} from '@backstage/plugin-catalog-react';
import { Box, TabProps } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Children,
  default as React,
  Fragment,
  isValidElement,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { EntityContextMenu } from '../EntityContextMenu/EntityContextMenu';
import { FavouriteEntity } from '../FavouriteEntity/FavouriteEntity';
import { UnregisterEntityDialog } from '../UnregisterEntityDialog/UnregisterEntityDialog';

type SubRoute = {
  path: string;
  title: string;
  children: JSX.Element;
  if?: (entity: Entity) => boolean;
  tabProps?: TabProps<React.ElementType, { component?: React.ElementType }>;
};

const Route: (props: SubRoute) => null = () => null;

// This causes all mount points that are discovered within this route to use the path of the route itself
attachComponentData(Route, 'core.gatherMountPoints', true);

function createSubRoutesFromChildren(
  childrenProps: React.ReactNode,
  entity: Entity | undefined,
): SubRoute[] {
  // Directly comparing child.type with Route will not work with in
  // combination with react-hot-loader in storybook
  // https://github.com/gaearon/react-hot-loader/issues/304
  const routeType = (
    <Route path="" title="">
      <div />
    </Route>
  ).type;

  return Children.toArray(childrenProps).flatMap(child => {
    if (!isValidElement(child)) {
      return [];
    }

    if (child.type === Fragment) {
      return createSubRoutesFromChildren(child.props.children, entity);
    }

    if (child.type !== routeType) {
      throw new Error('Child of EntityLayout must be an EntityLayout.Route');
    }

    const { path, title, children, if: condition, tabProps } = child.props;
    if (condition && entity && !condition(entity)) {
      return [];
    }

    return [{ path, title, children, tabProps }];
  });
}

const EntityLayoutTitle = ({
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

const headerProps = (
  paramKind: string | undefined,
  paramNamespace: string | undefined,
  paramName: string | undefined,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } => {
  const kind = paramKind ?? entity?.kind ?? '';
  const namespace = paramNamespace ?? entity?.metadata.namespace ?? '';
  const name = paramName ?? entity?.metadata.name ?? '';
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

// NOTE(freben): Intentionally not exported at this point, since it's part of
// the unstable extra context menu items concept below
type ExtraContextMenuItem = {
  title: string;
  Icon: IconComponent;
  onClick: () => void;
};

type EntityLayoutProps = {
  UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
  children?: React.ReactNode;
};

/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 */
export const EntityLayout = ({
  UNSTABLE_extraContextMenuItems,
  children,
}: EntityLayoutProps) => {
  const { kind, namespace, name } = useEntityCompoundName();
  const { entity, loading, error } = useContext(EntityContext);

  const routes = createSubRoutesFromChildren(children, entity);
  const { headerTitle, headerType } = headerProps(
    kind,
    namespace,
    name,
    entity,
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
        title={<EntityLayoutTitle title={headerTitle} entity={entity!} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      >
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

      {loading && <Progress />}

      {entity && <RoutedTabs routes={routes} />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
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

EntityLayout.Route = Route;
