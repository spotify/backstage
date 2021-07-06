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

export {
  techRadarPlugin,
  techRadarPlugin as plugin,
  TechRadarPage,
} from './plugin';

export { RadarPage as Router } from './components/RadarPage';

/**
 * The TypeScript API for configuring Tech Radar.
 */
export * from './api';

/**
 * The React component for more advanced use cases.
 */
export { default as TechRadarComponent } from './components/RadarComponent';
