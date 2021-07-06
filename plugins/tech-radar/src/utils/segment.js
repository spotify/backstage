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

export default class Segment {
  constructor(quadrant, ring, radius, nextSeed) {
    this.nextSeed = nextSeed;
    this.polarMin = {
      t: quadrant.radialMin,
      r: ring.innerRadius,
    };
    this.polarMax = {
      t: quadrant.radialMax,
      r: ring.outerRadius,
    };
    this.cartesianMin = {
      x: 15 * quadrant.offsetX,
      y: 15 * quadrant.offsetY,
    };
    this.cartesianMax = {
      x: radius * quadrant.offsetX,
      y: radius * quadrant.offsetY,
    };
  }

  clipx(d) {
    const c = boundedBox(d, this.cartesianMin, this.cartesianMax);
    const p = boundedRing(polar(c), this.polarMin.r + 15, this.polarMax.r - 15);
    d.x = cartesian(p).x;
    return d.x;
  }

  clipy(d) {
    const c = boundedBox(d, this.cartesianMin, this.cartesianMax);
    const p = boundedRing(polar(c), this.polarMin.r + 15, this.polarMax.r - 15);
    d.y = cartesian(p).y;
    return d.y;
  }

  random() {
    return cartesian({
      t: this._randomBetween(this.polarMin.t, this.polarMax.t),
      r: this._normalBetween(this.polarMin.r, this.polarMax.r),
    });
  }

  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  _random() {
    const x = Math.sin(this.nextSeed()) * 10000;
    return x - Math.floor(x);
  }

  _randomBetween(min, max) {
    return min + this._random() * (max - min);
  }

  _normalBetween(min, max) {
    return min + (this._random() + this._random()) * 0.5 * (max - min);
  }
}

function polar({ x, y }) {
  return {
    t: Math.atan2(y, x),
    r: Math.sqrt(x * x + y * y),
  };
}

function cartesian({ r, t }) {
  return {
    x: r * Math.cos(t),
    y: r * Math.sin(t),
  };
}

function boundedInterval(value, min, max) {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

function boundedRing(polarValue, rMin, rMax) {
  return {
    t: polarValue.t,
    r: boundedInterval(polarValue.r, rMin, rMax),
  };
}

function boundedBox(point, min, max) {
  return {
    x: boundedInterval(point.x, min.x, max.x),
    y: boundedInterval(point.y, min.y, max.y),
  };
}
