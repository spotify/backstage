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

import { ConfigReader } from '@backstage/config';
import { readLdapConfig } from './config';

describe('readLdapConfig', () => {
  it('applies all of the defaults', () => {
    const config = {
      providers: [
        {
          target: 'target',
          users: {
            dn: 'udn',
          },
          groups: {
            dn: 'gdn',
          },
        },
      ],
    };
    const actual = readLdapConfig(new ConfigReader(config));
    const expected = [
      {
        target: 'target',
        bind: undefined,
        users: {
          dn: 'udn',
          options: {
            scope: 'one',
            attributes: ['*', '+'],
          },
          set: undefined,
          map: {
            rdn: 'uid',
            name: 'uid',
            displayName: 'cn',
            email: 'mail',
            memberOf: 'memberOf',
          },
        },
        groups: {
          dn: 'gdn',
          options: {
            scope: 'one',
            attributes: ['*', '+'],
          },
          set: undefined,
          map: {
            rdn: 'cn',
            name: 'cn',
            description: 'description',
            type: 'groupType',
            displayName: 'cn',
            memberOf: 'memberOf',
            members: 'member',
          },
        },
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('reads all the values', () => {
    const config = {
      providers: [
        {
          target: 'target',
          bind: { dn: 'bdn', secret: 's' },
          users: {
            dn: 'udn',
            options: {
              scope: 'base',
              attributes: ['*'],
              filter: 'f',
              paged: true,
            },
            set: { p: 'v' },
            map: {
              rdn: 'u',
              name: 'v',
              description: 'd',
              displayName: 'c',
              email: 'm',
              picture: 'p',
              memberOf: 'm',
            },
          },
          groups: {
            dn: 'gdn',
            options: {
              scope: 'base',
              attributes: ['*'],
              filter: 'f',
              paged: {
                pageSize: 7,
                pagePause: true,
              },
            },
            set: { p: 'v' },
            map: {
              rdn: 'u',
              name: 'v',
              description: 'd',
              type: 't',
              displayName: 'c',
              email: 'm',
              picture: 'p',
              memberOf: 'm',
              members: 'n',
            },
          },
        },
      ],
    };
    const actual = readLdapConfig(new ConfigReader(config));
    const expected = [
      {
        target: 'target',
        bind: { dn: 'bdn', secret: 's' },
        users: {
          dn: 'udn',
          options: {
            scope: 'base',
            attributes: ['*'],
            filter: 'f',
            paged: true,
          },
          set: { p: 'v' },
          map: {
            rdn: 'u',
            name: 'v',
            description: 'd',
            displayName: 'c',
            email: 'm',
            picture: 'p',
            memberOf: 'm',
          },
        },
        groups: {
          dn: 'gdn',
          options: {
            scope: 'base',
            attributes: ['*'],
            filter: 'f',
            paged: {
              pageSize: 7,
              pagePause: true,
            },
          },
          set: { p: 'v' },
          map: {
            rdn: 'u',
            name: 'v',
            description: 'd',
            type: 't',
            displayName: 'c',
            email: 'm',
            picture: 'p',
            memberOf: 'm',
            members: 'n',
          },
        },
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('supports multiline ldap query filter', () => {
    const config = {
      providers: [
        {
          target: 'target',
          users: {
            dn: 'udn',
            options: {
              filter: `
              (|
                (cn=foo bar)
                (cn=bar)
              )
              `,
            },
          },
          groups: {
            dn: 'gdn',
            options: {
              filter: 'f',
            },
          },
        },
      ],
    };
    const actual = readLdapConfig(new ConfigReader(config));

    const expected = '(|(cn=foo bar)(cn=bar))';
    expect(actual[0].users.options.filter).toEqual(expected);
  });
});
