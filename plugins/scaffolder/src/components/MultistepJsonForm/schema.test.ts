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

import { transformSchemaToProps } from './schema';

describe('transformSchemaToProps', () => {
  it('transforms deep schema', () => {
    const inputSchema = {
      type: 'object',
      'ui:welp': 'warp',
      properties: {
        field1: {
          type: 'string',
          'ui:derp': 'herp',
        },
        field2: {
          type: 'object',
          properties: {
            fieldX: {
              type: 'string',
              'ui:derp': 'xerp',
            },
          },
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      properties: {
        field1: {
          type: 'string',
        },
        field2: {
          type: 'object',
          properties: {
            fieldX: {
              type: 'string',
            },
          },
        },
      },
    };
    const expectedUiSchema = {
      'ui:welp': 'warp',
      field1: {
        'ui:derp': 'herp',
      },
      field2: {
        fieldX: {
          'ui:derp': 'xerp',
        },
      },
    };

    expect(transformSchemaToProps(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });

  it('transforms schema with anyOf fields', () => {
    const inputSchema = {
      type: 'object',
      anyOf: [
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 2',
              'ui:readonly': true,
            },
          },
        },
      ],
      oneOf: [
        {
          properties: {
            field4: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
      ],
      allOf: [
        {
          properties: {
            field5: {
              type: 'string',
              default: 'Value 1',
              'ui:readonly': true,
            },
          },
        },
      ],
      properties: {
        field1: {
          type: 'object',
          anyOf: [
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 2',
                  'ui:readonly': true,
                },
              },
            },
          ],
          oneOf: [
            {
              properties: {
                field4: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
          ],
          allOf: [
            {
              properties: {
                field5: {
                  type: 'string',
                  default: 'Value 1',
                  'ui:readonly': true,
                },
              },
            },
          ],
        },
        field2: {
          type: 'string',
          'ui:derp': 'xerp',
        },
      },
    };
    const expectedSchema = {
      type: 'object',
      anyOf: [
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
        {
          properties: {
            field3: {
              type: 'string',
              default: 'Value 2',
            },
          },
        },
      ],
      oneOf: [
        {
          properties: {
            field4: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
      ],
      allOf: [
        {
          properties: {
            field5: {
              type: 'string',
              default: 'Value 1',
            },
          },
        },
      ],
      properties: {
        field1: {
          type: 'object',
          anyOf: [
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
            {
              properties: {
                field3: {
                  type: 'string',
                  default: 'Value 2',
                },
              },
            },
          ],
          oneOf: [
            {
              properties: {
                field4: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
          ],
          allOf: [
            {
              properties: {
                field5: {
                  type: 'string',
                  default: 'Value 1',
                },
              },
            },
          ],
        },
        field2: {
          type: 'string',
        },
      },
    };
    const expectedUiSchema = {
      field3: {
        'ui:readonly': true,
      },
      field4: {
        'ui:readonly': true,
      },
      field5: {
        'ui:readonly': true,
      },
      field1: {
        field3: {
          'ui:readonly': true,
        },
        field4: {
          'ui:readonly': true,
        },
        field5: {
          'ui:readonly': true,
        },
      },
      field2: {
        'ui:derp': 'xerp',
      },
    };

    expect(transformSchemaToProps(inputSchema)).toEqual({
      schema: expectedSchema,
      uiSchema: expectedUiSchema,
    });
  });
});
