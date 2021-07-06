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

import {
  TemplateEntityV1beta2,
  templateEntityV1beta2Validator as validator,
} from './TemplateEntityV1beta2';

describe('templateEntityV1beta2Validator', () => {
  let entity: TemplateEntityV1beta2;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1beta2',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'website',
        parameters: {
          required: ['storePath', 'owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
            storePath: {
              type: 'string',
              title: 'Store path',
              description: 'GitHub store path in org/repo format',
            },
          },
        },
        steps: [
          {
            id: 'fetch',
            name: 'Fetch',
            action: 'fetch:plan',
            input: {
              url: './template',
            },
            if: '{{ parameters.owner }}',
          },
        ],
        output: {
          fetchUrl: '{{ steps.fetch.output.targetUrl }}',
        },
        owner: 'team-b@example.com',
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('accepts any other type', async () => {
    (entity as any).spec.type = 'hallo';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts missing parameters', async () => {
    delete (entity as any).spec.parameters;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts missing outputs', async () => {
    delete (entity as any).spec.outputs;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing steps', async () => {
    delete (entity as any).spec.steps;
    await expect(validator.check(entity)).rejects.toThrow(/steps/);
  });

  it('accepts step with missing id', async () => {
    delete (entity as any).spec.steps[0].id;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts step with missing name', async () => {
    delete (entity as any).spec.steps[0].name;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects step with missing action', async () => {
    delete (entity as any).spec.steps[0].action;
    await expect(validator.check(entity)).rejects.toThrow(/action/);
  });

  it('accepts missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong type owner', async () => {
    (entity as any).spec.owner = 5;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('accepts missing if', async () => {
    delete (entity as any).spec.steps[0].if;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts boolean in if', async () => {
    (entity as any).spec.steps[0].if = true;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('accepts empty if', async () => {
    (entity as any).spec.steps[0].if = '';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong type if', async () => {
    (entity as any).spec.steps[0].if = 5;
    await expect(validator.check(entity)).rejects.toThrow(/if/);
  });
});
