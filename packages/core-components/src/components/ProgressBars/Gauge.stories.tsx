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

import React from 'react';
import { Gauge } from './Gauge';

const containerStyle = { width: 300 };

export default {
  title: 'Data Display/Gauge',
  component: Gauge,
};

export const Default = () => (
  <div style={containerStyle}>
    <Gauge value={0.8} />
  </div>
);

export const MediumProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.5} />
  </div>
);

export const LowProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.2} />
  </div>
);

export const InverseLowProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.2} inverse />
  </div>
);

export const AbsoluteProgress = () => (
  <div style={containerStyle}>
    <Gauge value={89.2} fractional={false} unit="m/s" />
  </div>
);
