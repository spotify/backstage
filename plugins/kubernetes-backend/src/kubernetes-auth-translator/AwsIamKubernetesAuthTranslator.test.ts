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
import AWSMock from 'aws-sdk-mock';
import { AwsIamKubernetesAuthTranslator } from './AwsIamKubernetesAuthTranslator';
import { get, def } from 'bdd-lazy-var';

describe('AwsIamKubernetesAuthTranslator tests', () => {
  let valid: boolean = true;
  let role: any = undefined;
  let response: any = {
    Credentials: {
      AccessKeyId: 'bloop',
      SecretAccessKey: 'omg-so-secret',
      SessionToken: 'token',
    },
  };

  AWSMock.setSDKInstance(AWS);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  def('subject', () => {
    AWSMock.mock('STS', 'assumeRole', (_params: any, callback: Function) => {
      callback(null, response);
    });

    const authTranslator = new AwsIamKubernetesAuthTranslator();
    jest
      .spyOn(authTranslator, 'validCredentials')
      .mockImplementation(() => valid);
    return authTranslator.decorateClusterDetailsWithAuth({
      assumeRole: role,
      name: 'test-cluster',
      url: '',
      authProvider: 'aws',
    });
  });

  it('returns a signed url for aws credentials', async () => {
    // These credentials are not real.
    // Pulled from example in docs: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
    AWS.config.credentials = new AWS.Credentials(
      'AKIAIOSFODNN7EXAMPLE',
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    );

    const subject = await get('subject');
    expect(subject.serviceAccountToken).toBeDefined();
  });

  describe('When the role is assumed', () => {
    // These credentials are not real.
    // Pulled from example in docs: https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
    AWS.config.credentials = new AWS.Credentials(
      'AKIAIOSFODNN7EXAMPLE',
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    );
    role = 'SomeRole';

    describe('When the role is valid', () => {
      it('returns a signed url for aws credentials', async () => {
        const subject = await get('subject');
        expect(subject.serviceAccountToken).toBeDefined();
      });
    });

    describe('When the role is invalid', () => {
      it('returns the original AWS credentials', async () => {
        response = undefined;

        await expect(get('subject')).rejects.toThrow(/Unable to assume role:/);
      });
    });
  });

  it('throws when unable to get aws credentials', async () => {
    valid = false;
    AWS.config.credentials = undefined;
    await expect(get('subject')).rejects.toThrow('No AWS credentials found');
  });
});
