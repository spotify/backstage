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

import { KubernetesAuthTranslator } from './types';
import { GoogleKubernetesAuthTranslator } from './GoogleKubernetesAuthTranslator';
import { ServiceAccountKubernetesAuthTranslator } from './ServiceAccountKubernetesAuthTranslator';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';

export class KubernetesAuthTranslatorGenerator {
  static getKubernetesAuthTranslatorInstance(
    authProvider: string,
  ): KubernetesAuthTranslator {
    switch (authProvider) {
      case 'google': {
        return new GoogleKubernetesAuthTranslator();
      }
      case 'aws': {
        return new AwsIamKubernetesAuthTranslator();
      }
      case 'serviceAccount': {
        return new ServiceAccountKubernetesAuthTranslator();
      }
      default: {
        throw new Error(
          `authProvider "${authProvider}" has no KubernetesAuthTranslator associated with it`,
        );
      }
    }
  }
}
