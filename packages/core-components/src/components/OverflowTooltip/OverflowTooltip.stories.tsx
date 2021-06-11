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
import { Box } from '@material-ui/core';
import React from 'react';
import { OverflowTooltip } from './OverflowTooltip';

export default {
  title: 'Data Display/OverflowTooltip',
  component: OverflowTooltip,
};

const text =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

export const Default = () => (
  <Box maxWidth="200px">
    <OverflowTooltip text={text} />
  </Box>
);

export const MultiLine = () => (
  <Box maxWidth="200px">
    <OverflowTooltip text={text} line={2} />
  </Box>
);

export const DifferentTitle = () => (
  <Box maxWidth="200px">
    <OverflowTooltip
      title="Visit loremipsum.io for more info"
      text={text}
      line={2}
    />
  </Box>
);
