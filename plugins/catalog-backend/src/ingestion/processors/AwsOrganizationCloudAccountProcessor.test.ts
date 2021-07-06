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

import { AwsOrganizationCloudAccountProcessor } from './AwsOrganizationCloudAccountProcessor';
import * as winston from 'winston';

describe('AwsOrganizationCloudAccountProcessor', () => {
  describe('readLocation', () => {
    const processor = new AwsOrganizationCloudAccountProcessor({
      provider: {},
      logger: winston.createLogger(),
    });
    const location = { type: 'aws-cloud-accounts', target: '' };
    const emit = jest.fn();
    const listAccounts = jest.fn();

    processor.organizations.listAccounts = listAccounts;
    afterEach(() => jest.resetAllMocks());

    it('generates component entities for accounts', async () => {
      listAccounts.mockImplementation(() => {
        return {
          async promise() {
            return {
              Accounts: [
                {
                  Arn:
                    'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
                  Name: 'testaccount',
                },
              ],
              NextToken: undefined,
            };
          },
        };
      });
      await processor.readLocation(location, false, emit);
      expect(emit).toBeCalledWith({
        type: 'entity',
        location,
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Resource',
          metadata: {
            annotations: {
              'amazonaws.com/arn':
                'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
              'amazonaws.com/account-id': '957140518395',
              'amazonaws.com/organization-id': 'o-1vl18kc5a3',
            },
            name: 'testaccount',
            namespace: 'default',
          },
          spec: {
            type: 'cloud-account',
            owner: 'unknown',
          },
        },
      });
    });

    it('filters out accounts not in specified location target', async () => {
      const locationTest = {
        type: 'aws-cloud-accounts',
        target: 'o-1vl18kc5a3',
      };
      listAccounts.mockImplementation(() => {
        return {
          async promise() {
            return {
              Accounts: [
                {
                  Arn:
                    'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
                  Name: 'testaccount',
                },
                {
                  Arn:
                    'arn:aws:organizations::192594491037:account/o-zzzzzzzzz/957140518395',
                  Name: 'testaccount2',
                },
              ],
              NextToken: undefined,
            };
          },
        };
      });
      await processor.readLocation(locationTest, false, emit);
      expect(emit).toBeCalledTimes(1);
      expect(emit).toBeCalledWith({
        type: 'entity',
        location: locationTest,
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Resource',
          metadata: {
            annotations: {
              'amazonaws.com/arn':
                'arn:aws:organizations::192594491037:account/o-1vl18kc5a3/957140518395',
              'amazonaws.com/account-id': '957140518395',
              'amazonaws.com/organization-id': 'o-1vl18kc5a3',
            },
            name: 'testaccount',
            namespace: 'default',
          },
          spec: {
            type: 'cloud-account',
            owner: 'unknown',
          },
        },
      });
    });
  });
});
