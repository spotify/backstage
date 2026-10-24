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
import { render } from '@testing-library/react';
import validator from '@rjsf/validator-ajv8';
import { Form } from '../../Form';

describe('BUI FieldErrorTemplate accessibility', () => {
  it('should render inline error container with role="alert" and aria-live="polite"', () => {
    const { container } = render(
      <Form
        EXPERIMENTAL_theme="bui"
        validator={validator}
        schema={{
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 5 },
          },
        }}
        formData={{ name: 'abc' }}
        liveValidate
      />,
    );

    const alertElement = container.querySelector('[role="alert"]');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveAttribute('aria-live', 'polite');
  });
});
