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

import ldap, { Client, SearchEntry, SearchOptions } from 'ldapjs';
import { Logger } from 'winston';
import { BindConfig } from './config';
import { errorString } from './util';
import {
  ActiveDirectoryVendor,
  DefaultLdapVendor,
  LdapVendor,
} from './vendors';

/**
 * Basic wrapper for the ldapjs library.
 *
 * Helps out with promisifying calls, paging, binding etc.
 */
export class LdapClient {
  private vendor: Promise<LdapVendor> | undefined;

  static async create(
    logger: Logger,
    target: string,
    bind?: BindConfig,
  ): Promise<LdapClient> {
    const client = ldap.createClient({ url: target });

    // We want to have a catch-all error handler at the top, since the default
    // behavior of the client is to blow up the entire process when it fails,
    // unless an error handler is set.
    client.on('error', (err: ldap.Error) => {
      logger.warn(`LDAP client threw an error, ${errorString(err)}`);
    });

    if (!bind) {
      return new LdapClient(client);
    }

    return new Promise<LdapClient>((resolve, reject) => {
      const { dn, secret } = bind;
      client.bind(dn, secret, err => {
        if (err) {
          reject(`LDAP bind failed for ${dn}, ${errorString(err)}`);
        } else {
          resolve(new LdapClient(client));
        }
      });
    });
  }

  constructor(private readonly client: Client) {}

  /**
   * Performs an LDAP search operation.
   *
   * @param dn The fully qualified base DN to search within
   * @param options The search options
   */
  async search(dn: string, options: SearchOptions): Promise<SearchEntry[]> {
    try {
      return await new Promise<SearchEntry[]>((resolve, reject) => {
        const output: SearchEntry[] = [];

        this.client.search(dn, options, (err, res) => {
          if (err) {
            reject(new Error(errorString(err)));
            return;
          }

          res.on('searchReference', () => {
            reject(new Error('Unable to handle referral'));
          });

          res.on('searchEntry', entry => {
            output.push(entry);
          });

          res.on('error', e => {
            reject(new Error(errorString(e)));
          });

          res.on('end', r => {
            if (!r) {
              reject(new Error('Null response'));
            } else if (r.status !== 0) {
              reject(new Error(`Got status ${r.status}: ${r.errorMessage}`));
            } else {
              resolve(output);
            }
          });
        });
      });
    } catch (e) {
      throw new Error(`LDAP search at DN "${dn}" failed, ${e.message}`);
    }
  }

  /**
   * Get the Server Vendor.
   * Currently only detects Microsoft Active Directory Servers.
   *
   * @see https://ldapwiki.com/wiki/Determine%20LDAP%20Server%20Vendor
   */
  async getVendor(): Promise<LdapVendor> {
    if (this.vendor) {
      return this.vendor;
    }
    this.vendor = this.getRootDSE()
      .then(root => {
        if (root && root.raw?.forestFunctionality) {
          return ActiveDirectoryVendor;
        }
        return DefaultLdapVendor;
      })
      .catch(err => {
        this.vendor = undefined;
        throw err;
      });
    return this.vendor;
  }

  /**
   * Get the Root DSE.
   *
   * @see https://ldapwiki.com/wiki/RootDSE
   */
  async getRootDSE(): Promise<SearchEntry | undefined> {
    const result = await this.search('', {
      scope: 'base',
      filter: '(objectclass=*)',
    } as SearchOptions);
    if (result && result.length === 1) {
      return result[0];
    }
    return undefined;
  }
}
