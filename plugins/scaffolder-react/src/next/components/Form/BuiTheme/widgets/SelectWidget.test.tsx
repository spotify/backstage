/*
 * Copyright 2026 The Backstage Authors
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
import { render, screen, fireEvent } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from '../../Form';

describe('BUI SelectWidget', () => {
  it('should render a single-select dropdown', () => {
    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            color: {
              type: 'string',
              title: 'Color',
              enum: ['red', 'green', 'blue'],
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('should render a multi-select dropdown when schema uses array with uniqueItems', () => {
    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            environments: {
              title: 'Target Environments',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
              },
            },
          },
        }}
      />,
    );

    expect(screen.getByText('Target Environments')).toBeInTheDocument();
  });

  it('should select options and update form state for multi-select', () => {
    const onChange = jest.fn();

    render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            environments: {
              title: 'Environments',
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'string',
                enum: ['development', 'staging', 'production'],
              },
            },
          },
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Environments/i }));
    fireEvent.click(screen.getByRole('option', { name: 'development' }));

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.formData.environments).toEqual(['development']);
  });
});
