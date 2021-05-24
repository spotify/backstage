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

import { ApiEntity, getEntityName } from '@backstage/catalog-model';
import {
  CardTab,
  Progress,
  ResponseErrorPanel,
  TabbedCard,
  useApi,
} from '@backstage/core';
import { catalogApiRef, useEntity } from '@backstage/plugin-catalog-react';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';
import { apiDocsConfigRef } from '../../config';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  apiEntity?: ApiEntity;
};

export const ApiDefinitionCard = (_: Props) => {
  const { entity } = useEntity<ApiEntity>();
  const config = useApi(apiDocsConfigRef);
  const catalogClient = useApi(catalogApiRef);
  const { getApiDefinitionWidget } = config;
  const { value: definition, loading, error } = useAsync(async () => {
    if (!entity) {
      return undefined;
    }

    if (entity.spec.definition) {
      return entity.spec.definition;
    }

    // TODO: Move to catalog model
    const ATTACHMENT_API_DEFINITION = 'backstage.io/api-definition';
    const attachment = await catalogClient.getAttachment(
      getEntityName(entity),
      ATTACHMENT_API_DEFINITION,
    );
    return await attachment.text();
  }, [catalogClient, entity]);

  if (!entity) {
    return <Alert severity="error">Could not fetch the API</Alert>;
  }

  const definitionWidget = getApiDefinitionWidget(entity);

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (loading || !definition) {
    return <Progress />;
  }

  if (definitionWidget) {
    return (
      <TabbedCard title={entity.metadata.name}>
        <CardTab label={definitionWidget.title} key="widget">
          {definitionWidget.component(definition)}
        </CardTab>
        <CardTab label="Raw" key="raw">
          <PlainApiDefinitionWidget
            definition={definition}
            language={definitionWidget.rawLanguage || entity.spec.type}
          />
        </CardTab>
      </TabbedCard>
    );
  }

  return (
    <TabbedCard
      title={entity.metadata.name}
      children={[
        // Has to be an array, otherwise typescript doesn't like that this has only a single child
        <CardTab label={entity.spec.type} key="raw">
          <PlainApiDefinitionWidget
            definition={definition}
            language={entity.spec.type}
          />
        </CardTab>,
      ]}
    />
  );
};
