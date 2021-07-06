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
  ApiEntityV1alpha1,
  apiEntityV1alpha1Validator as validator,
} from './ApiEntityV1alpha1';

describe('ApiV1alpha1Validator', () => {
  let entity: ApiEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'openapi',
        lifecycle: 'production',
        owner: 'me',
        definition: `
openapi: "3.0.0"
info:
  version: 1.0.0
  title: Swagger Petstore
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      responses:
        '200':
          description: A paged array of pets
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pets"
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
    Pets:
      type: array
      items:
        $ref: "#/components/schemas/Pet"
`,
        system: 'system',
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
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

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing lifecycle', async () => {
    delete (entity as any).spec.lifecycle;
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects wrong lifecycle', async () => {
    (entity as any).spec.lifecycle = 7;
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects empty lifecycle', async () => {
    (entity as any).spec.lifecycle = '';
    await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects wrong owner', async () => {
    (entity as any).spec.owner = 7;
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    await expect(validator.check(entity)).rejects.toThrow(/owner/);
  });

  it('rejects missing definition', async () => {
    delete (entity as any).spec.definition;
    await expect(validator.check(entity)).rejects.toThrow(/definition/);
  });

  it('rejects wrong definition', async () => {
    (entity as any).spec.definition = 7;
    await expect(validator.check(entity)).rejects.toThrow(/definition/);
  });

  it('rejects empty definition', async () => {
    (entity as any).spec.definition = '';
    await expect(validator.check(entity)).rejects.toThrow(/definition/);
  });

  it('accepts missing system', async () => {
    delete (entity as any).spec.system;
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects wrong system', async () => {
    (entity as any).spec.system = 7;
    await expect(validator.check(entity)).rejects.toThrow(/system/);
  });

  it('rejects empty system', async () => {
    (entity as any).spec.system = '';
    await expect(validator.check(entity)).rejects.toThrow(/system/);
  });

  it('rejects additional properties', async () => {
    (entity as any).annotations = 'Test';
    await expect(validator.check(entity)).rejects.toThrow(
      /additional properties/,
    );
  });

  it('rejects with useful error message', async () => {
    (entity as any).annotations = 'Test';
    await expect(validator.check(entity)).rejects.toThrow(/annotations/);
  });
});
