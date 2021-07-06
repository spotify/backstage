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

import { SearchEntry } from 'ldapjs';

/**
 * An LDAP Vendor handles unique nuances between different vendors.
 */
export type LdapVendor = {
  /**
   * The attribute name that holds the distinguished name (DN) for an entry.
   */
  dnAttributeName: string;
  /**
   * The attribute name that holds a universal unique identifier for an entry.
   */
  uuidAttributeName: string;
  /**
   * Decode ldap entry values for a given attribute name to their string representation.
   *
   * @param entry The ldap entry
   * @param name The attribute to decode
   */
  decodeStringAttribute: (entry: SearchEntry, name: string) => string[];
};

export const DefaultLdapVendor: LdapVendor = {
  dnAttributeName: 'entryDN',
  uuidAttributeName: 'entryUUID',
  decodeStringAttribute: (entry, name) => {
    return decode(entry, name, value => {
      return value.toString();
    });
  },
};

export const ActiveDirectoryVendor: LdapVendor = {
  dnAttributeName: 'distinguishedName',
  uuidAttributeName: 'objectGUID',
  decodeStringAttribute: (entry, name) => {
    const decoder = (value: string | Buffer) => {
      if (name === ActiveDirectoryVendor.uuidAttributeName) {
        return formatGUID(value);
      }
      return value.toString();
    };
    return decode(entry, name, decoder);
  },
};

// Decode an attribute to a consumer
function decode(
  entry: SearchEntry,
  attributeName: string,
  decoder: (value: string | Buffer) => string,
): string[] {
  const values = entry.raw[attributeName];
  if (Array.isArray(values)) {
    return values.map(v => {
      return decoder(v);
    });
  } else if (values) {
    return [decoder(values)];
  }
  return [];
}

// Formats a Microsoft Active Directory binary-encoded uuid to a readable string
// See https://github.com/ldapjs/node-ldapjs/issues/297#issuecomment-137765214
function formatGUID(objectGUID: string | Buffer): string {
  let data: Buffer;
  if (typeof objectGUID === 'string') {
    data = new Buffer(objectGUID, 'binary');
  } else {
    data = objectGUID;
  }
  // GUID_FORMAT_D
  let template = '{3}{2}{1}{0}-{5}{4}-{7}{6}-{8}{9}-{10}{11}{12}{13}{14}{15}';

  // check each byte
  for (let i = 0; i < data.length; i++) {
    // @ts-ignore
    let dataStr = data[i].toString(16);
    dataStr = data[i] >= 16 ? dataStr : `0${dataStr}`;

    // insert that character into the template
    template = template.replace(`{${i}}`, dataStr);
  }
  return template;
}
