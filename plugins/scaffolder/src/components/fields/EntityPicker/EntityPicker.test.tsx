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

import { Entity } from '@backstage/catalog-model';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { FieldProps } from '@rjsf/core';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { EntityPicker } from './EntityPicker';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

const makeEntity = (kind: string, namespace: string, name: string): Entity => ({
  apiVersion: 'backstage.io/v1beta1',
  kind,
  metadata: { namespace, name },
});

describe('<EntityPicker />', () => {
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;
  let uiSchema: {
    'ui:options': { allowedKinds?: string[]; defaultKind?: string };
  };
  const rawErrors: string[] = [];
  const formData = undefined;

  let props: FieldProps;

  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(async () => ({ items: entities })),
    addLocation: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType;

  beforeEach(() => {
    const apis = ApiRegistry.with(catalogApiRef, catalogApi);
    entities = [
      makeEntity('Group', 'default', 'team-a'),
      makeEntity('Group', 'default', 'squad-b'),
    ];

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  describe('without allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': {} };
      props = ({
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown) as FieldProps<any>;

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for all entities', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith(undefined);
    });

    it('updates even if there is not an exact match', async () => {
      const { getByLabelText } = await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );
      const input = getByLabelText('Entity');

      userEvent.type(input, 'squ');
      input.blur();

      expect(onChange).toHaveBeenCalledWith('squ');
    });
  });

  describe('with allowedKinds', () => {
    beforeEach(() => {
      uiSchema = { 'ui:options': { allowedKinds: ['User'] } };
      props = ({
        onChange,
        schema,
        required,
        uiSchema,
        rawErrors,
        formData,
      } as unknown) as FieldProps<any>;

      catalogApi.getEntities.mockResolvedValue({ items: entities });
    });

    it('searches for users and groups', async () => {
      await renderInTestApp(
        <Wrapper>
          <EntityPicker {...props} />
        </Wrapper>,
      );

      expect(catalogApi.getEntities).toHaveBeenCalledWith({
        filter: {
          kind: ['User'],
        },
      });
    });
  });
});
