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

import color from 'color';
import { forceCollide, forceSimulation } from 'd3-force';
import Segment from '../../utils/segment';
import type { Ring, Quadrant, Entry } from '../../utils/types';

export const adjustQuadrants = (
  quadrants: Quadrant[],
  radius: number,
  width: number,
  height: number,
) => {
  /*
    0           1                             2           3 ← x stops index
    │           │                             │           │ ↓ y stops index
    ┼───────────┼─────────────────────────────┼───────────┼─0
    │           │        . -- ~~~ -- .        │           │
    │           │    .-~               ~-.    │           │
    │    <Q3>   │   /                     \   │   <Q2>    │
    │           │  /                       \  │           │
    ┼───────────┼─────────────────────────────┼───────────┼─1
    ┼───────────┼─────────────────────────────┼───────────┼─2
    │           │ |                         | │           │
    │           │  \                       /  │           │
    │    <Q1>   │   \                     /   │   <Q0>    │
    │           │    `-.               .-'    │           │
    │           │        ~- . ___ . -~        │           │
    ┼───────────┼─────────────────────────────┼───────────┼─3
     */

  const margin = 16;
  const xStops = [
    margin,
    width / 2 - radius - margin,
    width / 2 + radius + margin,
    width - margin,
  ];
  const yStops = [margin, height / 2 - margin, height / 2, height - margin];

  // The quadrant parameters correspond to Q[0..3] above.  They are in this order because of the
  // original Zalando code; maybe we should refactor them to be in reverse order?
  const legendParams = [
    {
      x: xStops[2],
      y: yStops[2],
      width: xStops[3] - xStops[2],
      height: yStops[3] - yStops[2],
    },
    {
      x: xStops[0],
      y: yStops[2],
      width: xStops[1] - xStops[0],
      height: yStops[3] - yStops[2],
    },
    {
      x: xStops[0],
      y: yStops[0],
      width: xStops[1] - xStops[0],
      height: yStops[1] - yStops[0],
    },
    {
      x: xStops[2],
      y: yStops[0],
      width: xStops[3] - xStops[2],
      height: yStops[1] - yStops[0],
    },
  ];

  quadrants.forEach((quadrant, index) => {
    const legendParam = legendParams[index % 4];

    quadrant.index = index;
    quadrant.radialMin = (index * Math.PI) / 2;
    quadrant.radialMax = ((index + 1) * Math.PI) / 2;
    quadrant.offsetX = index % 4 === 0 || index % 4 === 3 ? 1 : -1;
    quadrant.offsetY = index % 4 === 0 || index % 4 === 1 ? 1 : -1;
    quadrant.legendX = legendParam.x;
    quadrant.legendY = legendParam.y;
    quadrant.legendWidth = legendParam.width;
    quadrant.legendHeight = legendParam.height;
  });
};

export const adjustEntries = (
  entries: Entry[],
  quadrants: Quadrant[],
  rings: Ring[],
  radius: number,
  activeEntry?: Entry,
) => {
  let seed = 42;
  entries.forEach((entry, index) => {
    const quadrant = quadrants.find(q => {
      const match =
        typeof entry.quadrant === 'object' ? entry.quadrant.id : entry.quadrant;
      return q.id === match;
    });
    const ring = rings.find(r => {
      const match = typeof entry.ring === 'object' ? entry.ring.id : entry.ring;
      return r.id === match;
    });

    if (!quadrant) {
      throw new Error(
        `Unknown quadrant ${entry.quadrant} for entry ${entry.id}!`,
      );
    }
    if (!ring) {
      throw new Error(`Unknown ring ${entry.ring} for entry ${entry.id}!`);
    }

    entry.index = index;
    entry.quadrant = quadrant;
    entry.ring = ring;
    entry.segment = new Segment(quadrant, ring, radius, () => seed++);
    const point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.active = activeEntry ? entry.id === activeEntry.id : false;
    entry.color = entry.active
      ? entry.ring.color
      : color(entry.ring.color).desaturate(0.5).lighten(0.1).string();
  });

  const simulation = forceSimulation()
    .nodes(entries)
    .velocityDecay(0.19)
    .force('collision', forceCollide().radius(12).strength(0.85))
    .stop();

  for (
    let i = 0,
      n = Math.ceil(
        Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
      );
    i < n;
    ++i
  ) {
    simulation.tick();

    for (const entry of entries) {
      if (entry.segment) {
        entry.x = entry.segment.clipx(entry);
        entry.y = entry.segment.clipy(entry);
      }
    }
  }
};

export const adjustRings = (rings: Ring[], radius: number) => {
  rings.forEach((ring, index) => {
    ring.index = index;
    ring.outerRadius = ((index + 2) / (rings.length + 1)) * radius;
    ring.innerRadius =
      ((index === 0 ? 0 : index + 1) / (rings.length + 1)) * radius;
  });
};
