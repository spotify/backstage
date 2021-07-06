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

import { Theme, useMediaQuery } from '@material-ui/core';
import { Breakpoint, ColumnBreakpoints } from './types';

const colDefaults: ColumnBreakpoints = {
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 3,
};

export function useDynamicColumns(
  cols: ColumnBreakpoints | number | undefined,
): number {
  const matches: (Breakpoint | null)[] = [
    useMediaQuery((theme: Theme) => theme.breakpoints.up('xl')) ? 'xl' : null,
    useMediaQuery((theme: Theme) => theme.breakpoints.up('lg')) ? 'lg' : null,
    useMediaQuery((theme: Theme) => theme.breakpoints.up('md')) ? 'md' : null,
    useMediaQuery((theme: Theme) => theme.breakpoints.up('sm')) ? 'sm' : null,
    useMediaQuery((theme: Theme) => theme.breakpoints.up('xs')) ? 'xs' : null,
  ];

  let numOfCols = 1;

  if (typeof cols === 'number') {
    numOfCols = cols;
  } else {
    const breakpoint = matches.find(k => k !== null) ?? 'xs';
    numOfCols = cols?.[breakpoint] ?? colDefaults[breakpoint];
  }

  return numOfCols;
}
