/*
 * Copyright 2020 Spotify AB
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

import * as results from './results';

export { AnnotateLocationEntityProcessor } from './AnnotateLocationEntityProcessor';
export { AnnotateScmSlugEntityProcessor } from './AnnotateScmSlugEntityProcessor';
export { AwsOrganizationCloudAccountProcessor } from './AwsOrganizationCloudAccountProcessor';
export { BitbucketDiscoveryProcessor } from './BitbucketDiscoveryProcessor';
export { BuiltinKindsEntityProcessor } from './BuiltinKindsEntityProcessor';
export { CodeOwnersProcessor } from './CodeOwnersProcessor';
export { FileReaderProcessor } from './FileReaderProcessor';
export { GithubDiscoveryProcessor } from './GithubDiscoveryProcessor';
export { GithubOrgReaderProcessor } from './GithubOrgReaderProcessor';
export { LdapOrgReaderProcessor } from './LdapOrgReaderProcessor';
export { LocationEntityProcessor } from './LocationEntityProcessor';
export { MicrosoftGraphOrgReaderProcessor } from './MicrosoftGraphOrgReaderProcessor';
export { PlaceholderProcessor } from './PlaceholderProcessor';
export type { PlaceholderResolver } from './PlaceholderProcessor';
export { StaticLocationProcessor } from './StaticLocationProcessor';
export * from './types';
export { UrlReaderProcessor } from './UrlReaderProcessor';
export { parseEntityYaml } from './util/parse';
export { results };

export type { BitbucketRepositoryParser } from './bitbucket';
