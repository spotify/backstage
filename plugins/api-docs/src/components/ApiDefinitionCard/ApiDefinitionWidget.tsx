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
import React from 'react';
import { AsyncApiDefinitionWidget } from '../AsyncApiDefinitionWidget';
import { GraphQlDefinitionWidget } from '../GraphQlDefinitionWidget';
import { OpenApiDefinitionWidget } from '../OpenApiDefinitionWidget';

export type ApiDefinitionWidget = {
  type: string;
  title: string;
  component: (definition: string) => React.ReactElement;
  rawLanguage?: string;
};

export function defaultDefinitionWidgets(): ApiDefinitionWidget[] {
  return [
    {
      type: 'openapi',
      title: 'OpenAPI',
      rawLanguage: 'yaml',
      component: definition => (
        <OpenApiDefinitionWidget definition={definition} />
      ),
    },
    {
      type: 'asyncapi',
      title: 'AsyncAPI',
      rawLanguage: 'yaml',
      component: definition => (
        <AsyncApiDefinitionWidget definition={definition} />
      ),
    },
    {
      type: 'graphql',
      title: 'GraphQL',
      rawLanguage: 'graphql',
      component: definition => (
        <GraphQlDefinitionWidget definition={definition} />
      ),
    },
  ];
}
