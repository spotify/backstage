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

/**
 * The name of an entity annotation, that references the RDN of the LDAP object
 * it was ingested from.
 *
 * The RDN is the name of the leftmost attribute that identifies the item; for
 * example, for an item with the fully qualified DN
 * uid=john,ou=people,ou=spotify,dc=spotify,dc=net the generated entity would
 * have this annotation, with the value "john".
 */
export const LDAP_RDN_ANNOTATION = 'backstage.io/ldap-rdn';

/**
 * The name of an entity annotation, that references the DN of the LDAP object
 * it was ingested from.
 *
 * The DN is the fully qualified name that identifies the item; for example,
 * for an item with the DN uid=john,ou=people,ou=spotify,dc=spotify,dc=net the
 * generated entity would have this annotation, with that full string as its
 * value.
 */
export const LDAP_DN_ANNOTATION = 'backstage.io/ldap-dn';

/**
 * The name of an entity annotation, that references the UUID of the LDAP
 * object it was ingested from.
 *
 * The UUID is the globally unique ID that identifies the item; for example,
 * for an item with the UUID 76ef928a-b251-1037-9840-d78227f36a7e, the
 * generated entity would have this annotation, with that full string as its
 * value.
 */
export const LDAP_UUID_ANNOTATION = 'backstage.io/ldap-uuid';
