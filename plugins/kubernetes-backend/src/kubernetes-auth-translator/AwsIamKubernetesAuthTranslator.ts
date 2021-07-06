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
import AWS, { Credentials } from 'aws-sdk';
import { sign } from 'aws4';
import { ClusterDetails } from '../types/types';
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

export class AwsIamKubernetesAuthTranslator
  implements KubernetesAuthTranslator {
  async getBearerToken(clusterName: string): Promise<string> {
    const credentials = await new Promise((resolve, reject) => {
      AWS.config.getCredentials(err => {
        if (err) {
          reject(err);
        } else {
          resolve(AWS.config.credentials);
        }
      });
    });

    if (!(credentials instanceof Credentials)) {
      throw new Error('no AWS credentials found.');
    }
    await credentials.getPromise();
    const request = {
      host: `sts.amazonaws.com`,
      path: `/?Action=GetCallerIdentity&Version=2011-06-15&X-Amz-Expires=60`,
      headers: {
        'x-k8s-aws-id': clusterName,
      },
      signQuery: true,
    };
    const signedRequest = sign(request, {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    });

    return pipe([
      (signed: any) => `https://${signed.host}${signed.path}`,
      base64,
      removePadding,
      makeUrlSafe,
      prepend('k8s-aws-v1.'),
    ])(signedRequest);
  }

  async decorateClusterDetailsWithAuth(
    clusterDetails: ClusterDetails,
  ): Promise<ClusterDetails> {
    const clusterDetailsWithAuthToken: ClusterDetails = Object.assign(
      {},
      clusterDetails,
    );

    clusterDetailsWithAuthToken.serviceAccountToken = await this.getBearerToken(
      clusterDetails.name,
    );
    return clusterDetailsWithAuthToken;
  }
}
