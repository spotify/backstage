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

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { EntityRefLink } from './EntityRefLink';

describe('<EntityRefLink />', () => {
  it('renders link for entity in default namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText } = render(<EntityRefLink entityRef={entity} />, {
      wrapper: MemoryRouter,
    });

    expect(getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity in other namespace', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText } = render(<EntityRefLink entityRef={entity} />, {
      wrapper: MemoryRouter,
    });
    expect(getByText('component:test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity and hides default kind', () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        namespace: 'test',
      },
      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };
    const { getByText } = render(
      <EntityRefLink entityRef={entity} defaultKind="Component" />,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(getByText('test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name in default namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'default',
      name: 'software',
    };
    const { getByText } = render(<EntityRefLink entityRef={entityName} />, {
      wrapper: MemoryRouter,
    });
    expect(getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders link for entity name in other namespace', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    const { getByText } = render(<EntityRefLink entityRef={entityName} />, {
      wrapper: MemoryRouter,
    });
    expect(getByText('component:test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link for entity name and hides default kind', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    const { getByText } = render(
      <EntityRefLink entityRef={entityName} defaultKind="component" />,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(getByText('test/software')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });

  it('renders link with custom children', () => {
    const entityName = {
      kind: 'Component',
      namespace: 'test',
      name: 'software',
    };
    const { getByText } = render(
      <EntityRefLink entityRef={entityName} defaultKind="component">
        Custom Children
      </EntityRefLink>,
      {
        wrapper: MemoryRouter,
      },
    );
    expect(getByText('Custom Children')).toHaveAttribute(
      'href',
      '/catalog/test/component/software',
    );
  });
});
