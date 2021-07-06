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

import { resolve as resolvePath, dirname } from 'path';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';
import { TaskSpec } from './types';
import {
  getTemplaterKey,
  joinGitUrlPath,
  parseLocationAnnotation,
  TemplaterValues,
} from '../stages';

export function templateEntityToSpec(
  template: TemplateEntityV1alpha1,
  inputValues: TemplaterValues,
): TaskSpec {
  const steps: TaskSpec['steps'] = [];

  const { protocol, location } = parseLocationAnnotation(template);

  let url: string;
  if (protocol === 'file') {
    const path = resolvePath(dirname(location), template.spec.path || '.');

    url = `file://${path}`;
  } else {
    url = joinGitUrlPath(location, template.spec.path);
  }
  const templater = getTemplaterKey(template);

  const values = {
    ...inputValues,
    destination: {
      git: parseGitUrl(inputValues.storePath),
    },
  } as TemplaterValues;

  steps.push({
    id: 'prepare',
    name: 'Prepare',
    action: 'legacy:prepare',
    input: {
      protocol,
      url,
    },
  });

  steps.push({
    id: 'template',
    name: 'Template',
    action: 'legacy:template',
    input: {
      templater,
      values,
    },
  });

  steps.push({
    id: 'publish',
    name: 'Publish',
    action: 'legacy:publish',
    input: {
      values,
    },
  });

  steps.push({
    id: 'register',
    name: 'Register',
    action: 'catalog:register',
    input: {
      catalogInfoUrl: '{{ steps.publish.output.catalogInfoUrl }}',
    },
  });

  return {
    baseUrl: undefined, // not used by legacy actions
    values: {},
    steps,
    output: {
      remoteUrl: '{{ steps.publish.output.remoteUrl }}',
      catalogInfoUrl: '{{ steps.register.output.catalogInfoUrl }}',
      entityRef: '{{ steps.register.output.entityRef }}',
    },
  };
}
