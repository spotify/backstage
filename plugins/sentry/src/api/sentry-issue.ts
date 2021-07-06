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

type SentryPlatform = 'javascript' | 'javascript-react' | string;

type EventPoint = number[];

type SentryProject = {
  platform: SentryPlatform;
  slug: string;
  id: string;
  name: string;
};

type SentryIssueMetadata = {
  function?: string;
  type?: string;
  value?: string;
  filename?: string;
};

export type SentryIssue = {
  platform: SentryPlatform;
  lastSeen: string;
  numComments: number;
  userCount: number;
  stats: {
    '24h'?: EventPoint[];
    '12h'?: EventPoint[];
  };
  culprit: string;
  title: string;
  id: string;
  assignedTo: any;
  logger: any;
  type: string;
  annotations: any[];
  metadata: SentryIssueMetadata;
  status: string;
  subscriptionDetails: any;
  isPublic: boolean;
  hasSeen: boolean;
  shortId: string;
  shareId: string | null;
  firstSeen: string;
  count: string;
  permalink: string;
  level: string;
  isSubscribed: boolean;
  isBookmarked: boolean;
  project: SentryProject;
  statusDetails: any;
};

export type SentryApiError = {
  detail: string;
};
