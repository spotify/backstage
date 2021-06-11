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

import { render, within } from '@testing-library/react';
import { startCase } from 'lodash';
import React from 'react';
import { StructuredMetadataTable } from './StructuredMetadataTable';

describe('<StructuredMetadataTable />', () => {
  it('renders without exploding', () => {
    const metadata = { hello: 'world' };
    const { getByText } = render(
      <StructuredMetadataTable metadata={metadata} />,
    );
    expect(getByText(metadata.hello)).toBeInTheDocument();
  });

  describe('Item Mappings', () => {
    it('Iterates over and displays every field in the map', () => {
      const metadata = {
        field1: 'one',
        field2: 'two',
        field3: 'three',
      } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      for (const [key, value] of Object.entries(metadata)) {
        expect(getByText(startCase(key))).toBeInTheDocument();
        expect(getByText(value)).toBeInTheDocument();
      }
    });

    it('Supports primitive value fields', () => {
      const metadata = { strField: 'my field', intField: 1 } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      for (const [key, value] of Object.entries(metadata)) {
        expect(getByText(startCase(key))).toBeInTheDocument();
        expect(getByText(value.toString())).toBeInTheDocument();
      }
    });

    it('Supports array fields', () => {
      const metadata = { arrayField: ['arrVal1', 'arrVal2'] } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );
      const keys = Object.keys(metadata);
      keys.forEach(value => {
        expect(getByText(startCase(value))).toBeInTheDocument();
      });
      metadata.arrayField.forEach(value => {
        expect(getByText(value)).toBeInTheDocument();
      });
    });

    it('Supports boolean values', () => {
      const metadata = { foo: true, bar: false };
      const expectedValues = [
        ['Foo', '✅'],
        ['Bar', '❌'],
      ];

      const { getAllByRole } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      getAllByRole('row').forEach((row, index) => {
        const [firstCell, secondCell] = within(row).getAllByRole('cell');
        const [expectedKey, expectedValue] = expectedValues[index];

        expect(firstCell).toHaveTextContent(expectedKey);
        expect(secondCell).toHaveTextContent(expectedValue);
      });
    });

    it('Supports react elements', () => {
      const metadata = { react: <div id="findMe"> field </div> };
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      expect(getByText('field')).toBeInTheDocument();
    });

    it('Supports object elements', () => {
      const metadata = {
        config: { a: 1, b: 2 },
      } as const;
      const { getByText } = render(
        <StructuredMetadataTable metadata={metadata} />,
      );

      for (const [key, value] of Object.entries(metadata.config)) {
        expect(getByText(startCase(key), { exact: false })).toBeInTheDocument();
        expect(
          getByText(value.toString(), { exact: false }),
        ).toBeInTheDocument();
      }
    });
  });
});
