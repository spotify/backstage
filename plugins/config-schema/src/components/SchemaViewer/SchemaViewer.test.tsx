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

import { render, screen } from '@testing-library/react';
import { Schema } from 'jsonschema';
import React from 'react';
import { SchemaViewer } from './SchemaViewer';

describe('SchemaViewer', () => {
  it('should render a simple schema', () => {
    const schema = {
      type: 'object',
      properties: {
        a: {
          description: 'My A',
          type: 'string',
        },
        b: {
          description: 'My B',
          type: 'number',
        },
      },
    };

    render(<SchemaViewer schema={schema} />);

    expect(screen.getAllByText('a').length).toBe(2);
    expect(screen.getByText('My A')).toBeInTheDocument();

    expect(screen.getAllByText('b').length).toBe(2);
    expect(screen.getByText('My B')).toBeInTheDocument();
  });

  it('should render complex schema', () => {
    const schema: Schema = {
      type: 'object',
      properties: {
        a: {
          description: 'My A',
          type: 'object',
          patternProperties: {
            'prefix.*': {
              description: 'Prefix prop',
              type: 'string',
            },
          },
          additionalProperties: {
            description: 'Additional properties for A',
            type: 'number',
            minimum: 72,
            maximum: 79,
          },
        },
        b: {
          oneOf: [
            { type: 'string', description: 'B one of 1' },
            {
              type: 'array',
              description: 'B one of 2',
              items: {
                anyOf: [
                  { type: 'string', description: 'Any of B 1' },
                  { type: 'number', description: 'Any of B 2' },
                  {
                    type: 'object',
                    description: 'Any of B 3',
                    properties: {
                      deep: {
                        allOf: [
                          {
                            type: 'number',
                            description: 'Impossible 1',
                          },
                          {
                            type: 'boolean',
                            description: 'Impossible 2',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    render(<SchemaViewer schema={schema} />);

    expect(screen.getAllByText('a').length).toBe(2);
    expect(screen.getByText('My A')).toBeInTheDocument();
    expect(screen.getByText('a.<prefix.*>')).toBeInTheDocument();
    expect(screen.getByText('Prefix prop')).toBeInTheDocument();

    expect(screen.getByText('a.*')).toBeInTheDocument();
    expect(screen.getByText('Additional properties for A')).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('79')).toBeInTheDocument();

    expect(screen.getAllByText('b').length).toBe(2);
    expect(screen.getByText('b/1')).toBeInTheDocument();
    expect(screen.getByText('B one of 1')).toBeInTheDocument();

    expect(screen.getByText('b/2')).toBeInTheDocument();
    expect(screen.getByText('B one of 2')).toBeInTheDocument();

    expect(screen.getByText('b/2[]')).toBeInTheDocument();
    expect(screen.getByText('b/2[]/1')).toBeInTheDocument();
    expect(screen.getByText('Any of B 1')).toBeInTheDocument();
    expect(screen.getByText('b/2[]/2')).toBeInTheDocument();
    expect(screen.getByText('Any of B 2')).toBeInTheDocument();
    expect(screen.getByText('b/2[]/3')).toBeInTheDocument();
    expect(screen.getByText('Any of B 3')).toBeInTheDocument();

    expect(screen.getByText('b/2[]/3.deep')).toBeInTheDocument();
    expect(screen.getByText('b/2[]/3.deep/1')).toBeInTheDocument();
    expect(screen.getByText('Impossible 1')).toBeInTheDocument();
    expect(screen.getByText('b/2[]/3.deep/2')).toBeInTheDocument();
    expect(screen.getByText('Impossible 2')).toBeInTheDocument();
  });
});
