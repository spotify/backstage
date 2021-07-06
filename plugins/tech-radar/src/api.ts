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

import { MovedState } from './utils/types';
import { createApiRef } from '@backstage/core-plugin-api';

export const techRadarApiRef = createApiRef<TechRadarApi>({
  id: 'plugin.techradar.service',
  description: 'Used to populate data in the TechRadar plugin',
});

export interface TechRadarApi {
  /**
   * Loads the TechRadar response data to pass through to the TechRadar component.
   * Takes the id prop of the TechRadarComponent or TechRadarPage to distinguish between multiple radars if needed
   */
  load: (id: string | undefined) => Promise<TechRadarLoaderResponse>;
}

/*
 * Types related to the Radar's visualization.
 */

export interface RadarRing {
  id: string;
  name: string;
  color: string;
}

export interface RadarQuadrant {
  id: string;
  name: string;
}

export interface RadarEntry {
  key: string; // react key
  id: string;
  quadrant: string;
  title: string;
  url: string;
  timeline: Array<RadarEntrySnapshot>;
  description?: string;
}

export interface RadarEntrySnapshot {
  date: Date;
  ringId: string;
  description?: string;
  moved?: MovedState;
}

/*
 * Types related to data collection for the Radar.
 */

export interface TechRadarLoaderResponse {
  quadrants: RadarQuadrant[];
  rings: RadarRing[];
  entries: RadarEntry[];
}

/*
 * Set up the Radar as a Backstage component.
 */

export interface TechRadarComponentProps {
  id?: string;
  width: number;
  height: number;
  svgProps?: object;
}
