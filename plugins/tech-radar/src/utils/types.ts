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

// Parameters for a ring; its index in an array determines how close to the center this ring is.
export type Ring = {
  id: string;
  index?: number;
  name: string;
  color: string;
  outerRadius?: number;
  innerRadius?: number;
};

// Parameters for a quadrant (there should be exactly 4 of course)
export type Quadrant = {
  id: string;
  index?: number;
  name: string;
  legendX?: number;
  legendY?: number;
  legendWidth?: number;
  legendHeight?: number;
  radialMin?: number;
  radialMax?: number;
  offsetX?: number;
  offsetY?: number;
};

export type Segment = {
  clipx: Function;
  clipy: Function;
  random: Function;
};

export enum MovedState {
  Down = -1,
  NoChange = 0,
  Up = 1,
}

export type Entry = {
  id: string;
  index?: number;
  x?: number;
  y?: number;
  color?: string;
  segment?: Segment;
  // The quadrant where this entry belongs
  quadrant: Quadrant;
  // The ring where this entry belongs
  ring: Ring;
  // The label that's shown in the legend and on hover
  title: string;
  // An URL to a longer description as to why this entry is where it is
  url?: string;
  // How this entry has recently moved; -1 for "down", +1 for "up", 0 for not moved
  moved?: MovedState;
  // Most recent description to display in the UI
  description?: string;
  active?: boolean;
  timeline?: Array<EntrySnapshot>;
};

export type EntrySnapshot = {
  date: Date;
  ring: Ring;
  description?: string;
  moved?: MovedState;
};

// The same as Entry except quadrant/ring are declared by their string ID instead of being the actual objects
export type DeclaredEntry = Entry & {
  quadrant: string;
  ring: string;
};
