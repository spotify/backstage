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

import React from 'react';

type Props = {
  text: string;
  color: string;
};

export const ShortcutIcon = ({ text, color }: Props) => {
  const size = 28;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      height={size}
      width={size}
      style={{ filter: 'contrast(150%) brightness(1.4)' }}
    >
      <circle r={size / 2} cx={size / 2} cy={size / 2} fill={color} />
      <text
        dy={2 + size / 2}
        dx={size / 2}
        fontWeight="bold"
        fontSize="13"
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="black"
      >
        {text}
      </text>
    </svg>
  );
};
