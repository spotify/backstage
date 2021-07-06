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

import React from 'react';
import {
  Sparklines,
  SparklinesLine,
  SparklinesLineProps,
  SparklinesProps,
} from 'react-sparklines';
import { useTheme } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

function color(data: number[], theme: BackstageTheme): string | undefined {
  const lastNum = data[data.length - 1];
  if (!lastNum) return undefined;
  if (lastNum >= 0.9) return theme.palette.status.ok;
  if (lastNum >= 0.5) return theme.palette.status.warning;
  return theme.palette.status.error;
}

export const TrendLine = (
  props: SparklinesProps &
    Pick<SparklinesLineProps, 'color'> & { title?: string },
) => {
  const theme = useTheme<BackstageTheme>();

  if (!props.data) return null;
  return (
    <Sparklines width={120} height={30} min={0} max={1} {...props}>
      {props.title && <title>{props.title}</title>}
      <SparklinesLine color={props.color ?? color(props.data, theme)} />
    </Sparklines>
  );
};
