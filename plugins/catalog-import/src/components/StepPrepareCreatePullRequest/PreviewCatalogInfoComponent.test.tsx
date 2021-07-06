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
import { makeStyles } from '@material-ui/core';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { PreviewCatalogInfoComponent } from './PreviewCatalogInfoComponent';

const useStyles = makeStyles({
  displayNone: {
    display: 'none',
  },
});

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Kind',
    metadata: {
      name: 'name',
    },
  },
  {
    apiVersion: '1',
    kind: 'Kind_2',
    metadata: {
      name: 'name',
    },
  },
];

describe('<PreviewCatalogInfoComponent />', () => {
  it('renders without exploding', async () => {
    const { getByText } = render(
      <PreviewCatalogInfoComponent
        repositoryUrl="http://my-repository/a/"
        entities={entities}
      />,
    );

    const repositoryUrl = getByText('http://my-repository/a/catalog-info.yaml');
    const kindText = getByText('Kind_2');
    expect(repositoryUrl).toBeInTheDocument();
    expect(repositoryUrl).toBeVisible();
    expect(kindText).toBeInTheDocument();
    expect(kindText).toBeVisible();
  });

  it('renders card with custom styles', async () => {
    const { result } = renderHook(() => useStyles());

    const { getByText } = render(
      <PreviewCatalogInfoComponent
        repositoryUrl="http://my-repository/a/"
        entities={entities}
        classes={{ card: result.current.displayNone }}
      />,
    );

    const repositoryUrl = getByText('http://my-repository/a/catalog-info.yaml');
    const kindText = getByText('Kind_2');
    expect(repositoryUrl).toBeInTheDocument();
    expect(repositoryUrl).not.toBeVisible();
    expect(kindText).toBeInTheDocument();
    expect(kindText).not.toBeVisible();
  });

  it('renders with custom styles', async () => {
    const { result } = renderHook(() => useStyles());

    const { getByText } = render(
      <PreviewCatalogInfoComponent
        repositoryUrl="http://my-repository/a/"
        entities={entities}
        classes={{ cardContent: result.current.displayNone }}
      />,
    );

    const repositoryUrl = getByText('http://my-repository/a/catalog-info.yaml');
    const kindText = getByText('Kind_2');
    expect(repositoryUrl).toBeInTheDocument();
    expect(repositoryUrl).toBeVisible();
    expect(kindText).toBeInTheDocument();
    expect(kindText).not.toBeVisible();
  });
});
