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

import {
  EscalationPolicyInfo,
  Incident,
  Team,
  User,
} from '../components/types';

export const MOCKED_USER: User = {
  createdAt: '2021-02-01T23:38:38Z',
  displayName: 'Test User',
  email: 'test@example.com',
  firstName: 'FirstNameTest',
  lastName: 'LastNameTest',
  passwordLastUpdated: '2021-02-01T23:38:38Z',
  username: 'test_user',
  verified: true,
  _selfUrl: '/api-public/v1/user/test_user',
};

export const MOCKED_ON_CALL = [
  {
    team: { name: 'team_example', slug: 'team-zEalMCgwYSA0Lt40' },
    oncallNow: [
      {
        escalationPolicy: { name: 'Example', slug: 'team-zEalMCgwYSA0Lt40' },
        users: [{ onCalluser: { username: 'test_user' } }],
      },
    ],
  },
];

export const MOCK_INCIDENT: Incident = {
  alertCount: 1,
  currentPhase: 'ACKED',
  entityDisplayName: 'test-incident',
  entityId: 'entityId',
  entityState: 'CRITICAL',
  entityType: 'SERVICE',
  incidentNumber: '1',
  lastAlertId: 'lastAlertId',
  lastAlertTime: '2021-02-03T00:13:11Z',
  routingKey: 'routingdefault',
  service: 'test',
  startTime: '2021-02-03T00:13:11Z',
  pagedTeams: ['team-O9SqT13fsnCstjMi'],
  pagedUsers: [],
  pagedPolicies: [
    {
      policy: {
        name: 'Generated Direct User Policy for test_user',
        slug: 'directUserPolicySlug-test',
        _selfUrl: '/test',
      },
    },
  ],
  transitions: [{ name: 'ACKED', at: '2021-02-03T01:20:00Z', by: 'test' }],
  monitorName: 'vouser-user',
  monitorType: 'Manual',
  firstAlertUuid: 'firstAlertUuid',
  incidentLink: 'https://portal.victorops.com/example',
};

export const MOCK_TEAM: Team = {
  _selfUrl: '/api-public/v1/team/team-O9SqT13fsnCstjMi',
  _membersUrl: '/api-public/v1/team/team-O9SqT13fsnCstjMi/members',
  _policiesUrl: '/api-public/v1/team/team-O9SqT13fsnCstjMi/policies',
  _adminsUrl: '/api-public/v1/team/team-O9SqT13fsnCstjMi/admins',
  name: 'test',
  slug: 'team-O9SqT13fsnCstjMi',
  memberCount: 1,
  version: 1,
  isDefaultTeam: false,
};

export const MOCK_TEAM_NO_INCIDENTS: Team = {
  ...MOCK_TEAM,
  name: 'test-noincidents',
  slug: 'team-O9SqT13fsnCstjMj',
};

export const ESCALATION_POLICIES: EscalationPolicyInfo[] = [
  {
    policy: {
      name: 'Example',
      slug: 'team-zEalMCgwYSA0Lt40',
      _selfUrl: '/api-public/v1/policies/team-zEalMCgwYSA0Lt40',
    },
    team: { name: 'Example', slug: 'team-zEalMCgwYSA0Lt40' },
  },
];
