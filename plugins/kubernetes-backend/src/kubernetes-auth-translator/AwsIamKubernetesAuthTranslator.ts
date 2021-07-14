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
import { sign } from 'aws4';
import { AWSClusterDetails } from '../types/types';
import { KubernetesAuthTranslator } from './types';

const base64 = (str: string) =>
  Buffer.from(str.toString(), 'binary').toString('base64');
const prepend = (prep: string) => (str: string) => prep + str;
const replace = (search: string | RegExp, substitution: string) => (
  str: string,
) => str.replace(search, substitution);
const pipe = (fns: ReadonlyArray<any>) => (thing: string): string =>
  fns.reduce((val, fn) => fn(val), thing);
const removePadding = replace(/=+$/, '');
const makeUrlSafe = pipe([replace('+', '-'), replace('/', '_')]);

type SigningCreds = {
  accessKeyId: string | undefined;
  secretAccessKey: string | undefined;
  sessionToken: string | undefined;
};

export class AwsIamKubernetesAuthTranslator
  implements KubernetesAuthTranslator {
  validCredentials(creds: SigningCreds): boolean {
    if (!creds.accessKeyId || !creds.secretAccessKey || !creds.sessionToken) {
      return false;
    }
    return true;
  }

  async getCredentials(assumeRole: string | undefined): Promise<SigningCreds> {
    return new Promise<SigningCreds>(async (resolve, reject) => {
      await AWS.config.getCredentials(err => {
        if (err) {
          console.error('Unable to load aws config.');
          reject(err);
        }
      });

      let creds: SigningCreds = {
        accessKeyId: AWS.config.credentials?.accessKeyId,
        secretAccessKey: AWS.config.credentials?.secretAccessKey,
        sessionToken: AWS.config.credentials?.sessionToken,
      };

      if (!this.validCredentials(creds))
        return reject(Error('No AWS credentials found.'));
      if (!assumeRole) return resolve(creds);

      try {
        const params = {
          RoleArn: assumeRole,
          RoleSessionName: 'backstage-login',
        };
        const assumedRole = await new AWS.STS().assumeRole(params).promise();

        if (!assumedRole.Credentials) {
          throw new Error(`No credentials returned for role ${assumeRole}`);
        }

        creds = {
          accessKeyId: assumedRole.Credentials.AccessKeyId,
          secretAccessKey: assumedRole.Credentials.SecretAccessKey,
          sessionToken: assumedRole.Credentials.SessionToken,
        };
      } catch (e) {
        console.warn(`There was an error assuming the role: ${e}`);
        return reject(Error(`Unable to assume role: ${e}`));
      }
      return resolve(creds);
    });
  }
  async getBearerToken(
    clusterName: string,
    assumeRole: string | undefined,
  ): Promise<string> {
    const credentials = await this.getCredentials(assumeRole);

    const request = {
      host: `sts.amazonaws.com`,
      path: `/?Action=GetCallerIdentity&Version=2011-06-15&X-Amz-Expires=60`,
      headers: {
        'x-k8s-aws-id': clusterName,
      },
      signQuery: true,
    };

    const signedRequest = sign(request, credentials);

    return pipe([
      (signed: any) => `https://${signed.host}${signed.path}`,
      base64,
      removePadding,
      makeUrlSafe,
      prepend('k8s-aws-v1.'),
    ])(signedRequest);
  }

  async decorateClusterDetailsWithAuth(
    clusterDetails: AWSClusterDetails,
  ): Promise<AWSClusterDetails> {
    const clusterDetailsWithAuthToken: AWSClusterDetails = Object.assign(
      {},
      clusterDetails,
    );

    clusterDetailsWithAuthToken.serviceAccountToken = await this.getBearerToken(
      clusterDetails.name,
      clusterDetails.assumeRole,
    );
    return clusterDetailsWithAuthToken;
  }
}
