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

import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { techdocsApiRef } from '../../api';
import { Reader } from './Reader';
import { TechDocsPageHeader } from './TechDocsPageHeader';

import { Content, Page } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

export const TechDocsPage = () => {
  const [documentReady, setDocumentReady] = useState<boolean>(false);
  const { namespace, kind, name } = useParams();

  const techdocsApi = useApi(techdocsApiRef);

  const { value: techdocsMetadataValue } = useAsync(() => {
    if (documentReady) {
      return techdocsApi.getTechDocsMetadata({ kind, namespace, name });
    }

    return Promise.resolve(undefined);
  }, [kind, namespace, name, techdocsApi, documentReady]);

  const { value: entityMetadataValue } = useAsync(() => {
    return techdocsApi.getEntityMetadata({ kind, namespace, name });
  }, [kind, namespace, name, techdocsApi]);

  const onReady = useCallback(() => {
    setDocumentReady(true);
  }, [setDocumentReady]);

  return (
    <Page themeId="documentation">
      <TechDocsPageHeader
        techDocsMetadata={techdocsMetadataValue}
        entityMetadata={entityMetadataValue}
        entityId={{
          kind,
          namespace,
          name,
        }}
      />
      <Content data-testid="techdocs-content">
        <Reader
          onReady={onReady}
          entityId={{
            kind,
            namespace,
            name,
          }}
        />
      </Content>
    </Page>
  );
};
