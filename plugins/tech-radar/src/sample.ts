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

import {
  RadarRing,
  RadarQuadrant,
  RadarEntry,
  TechRadarLoaderResponse,
  TechRadarApi,
} from './api';

const rings = new Array<RadarRing>();
rings.push({ id: 'use', name: 'USE', color: '#93c47d' });
rings.push({ id: 'trial', name: 'TRIAL', color: '#93d2c2' });
rings.push({ id: 'assess', name: 'ASSESS', color: '#fbdb84' });
rings.push({ id: 'hold', name: 'HOLD', color: '#efafa9' });

const quadrants = new Array<RadarQuadrant>();
quadrants.push({ id: 'infrastructure', name: 'Infrastructure' });
quadrants.push({ id: 'frameworks', name: 'Frameworks' });
quadrants.push({ id: 'languages', name: 'Languages' });
quadrants.push({ id: 'process', name: 'Process' });

const entries = new Array<RadarEntry>();
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'use',
      date: new Date('2020-08-06'),
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    },
  ],
  url: '#',
  key: 'javascript',
  id: 'javascript',
  title: 'JavaScript',
  quadrant: 'languages',
  description:
    'Excepteur **sint** occaecat *cupidatat* non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
});
entries.push({
  timeline: [
    {
      moved: -1,
      ringId: 'use',
      date: new Date('2020-08-06'),
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    },
  ],
  url: '#',
  key: 'typescript',
  id: 'typescript',
  title: 'TypeScript',
  quadrant: 'languages',
  description:
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat',
});
entries.push({
  timeline: [
    {
      moved: 1,
      ringId: 'use',
      date: new Date('2020-08-06'),
      description:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    },
  ],
  url: 'https://webpack.js.org/',
  key: 'webpack',
  id: 'webpack',
  title: 'Webpack',
  quadrant: 'frameworks',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'use',
      date: new Date('2020-08-06'),
    },
  ],
  url: 'https://reactjs.org/',
  key: 'react',
  id: 'react',
  title: 'React',
  quadrant: 'frameworks',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'use',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'code-reviews',
  id: 'code-reviews',
  title: 'Code Reviews',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'assess',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'mob-programming',
  id: 'mob-programming',
  title: 'Mob Programming',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      moved: 0,
      ringId: 'use',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'docs-like-code',
  id: 'docs-like-code',
  title: 'Docs-like-code',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      ringId: 'hold',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'force-push',
  id: 'force-push',
  title: 'Force push to master',
  quadrant: 'process',
});
entries.push({
  timeline: [
    {
      ringId: 'use',
      date: new Date('2020-08-06'),
    },
  ],
  url: '#',
  key: 'github-actions',
  id: 'github-actions',
  title: 'GitHub Actions',
  quadrant: 'infrastructure',
});

export const mock: TechRadarLoaderResponse = {
  entries,
  quadrants,
  rings,
};

export class SampleTechRadarApi implements TechRadarApi {
  async load() {
    return mock;
  }
}
