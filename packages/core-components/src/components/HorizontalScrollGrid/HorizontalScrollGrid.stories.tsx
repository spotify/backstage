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
import { HorizontalScrollGrid } from './HorizontalScrollGrid';

const cardContentStyle = { height: 0, padding: 150, margin: 20 };
const containerStyle = { width: 800, height: 400, margin: 20 };
const opacityArray = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

export default {
  title: 'Layout/HorizontalScrollGrid',
  component: HorizontalScrollGrid,
};

export const Default = () => (
  <div style={containerStyle}>
    <HorizontalScrollGrid>
      {opacityArray.map(element => {
        const style = { backgroundColor: `rgba(0, 185, 151, ${element})` };
        return <div style={{ ...style, ...cardContentStyle }} key={element} />;
      })}
    </HorizontalScrollGrid>
  </div>
);
