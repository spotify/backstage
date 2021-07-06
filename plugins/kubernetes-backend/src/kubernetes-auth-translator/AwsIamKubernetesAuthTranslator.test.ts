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
import AWS from 'aws-sdk';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';

describe('AwsIamKubernetesAuthTranslator tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('returns a signed url for aws credentials', async () => {
    const authTranslator = new AwsIamKubernetesAuthTranslator();

    // These credentials are not real.
    // Pulled from example in docs: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
    AWS.config.credentials = new AWS.Credentials(
      'AKIAIOSFODNN7EXAMPLE',
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    );

    const clusterDetails = await authTranslator.decorateClusterDetailsWithAuth({
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
    expect(clusterDetails.serviceAccountToken).toBeDefined();
  });

  it('throws when unable to get aws credentials', async () => {
    AWS.config.credentials = undefined;
    const authTranslator = new AwsIamKubernetesAuthTranslator();
    const promise = authTranslator.decorateClusterDetailsWithAuth({
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
    await expect(promise).rejects.toThrow(
      'Could not load credentials from any providers',
    );
  });
});
