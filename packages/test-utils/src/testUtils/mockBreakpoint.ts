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

import { act } from '@testing-library/react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const queryToBreakpoint = {
  '(min-width:1920px)': 'xl',
  '(min-width:1280px)': 'lg',
  '(min-width:960px)': 'md',
  '(min-width:600px)': 'sm',
  '(min-width:0px)': 'xs',
} as Record<string, Breakpoint>;

function toBreakpoint(query: string) {
  const breakpoint = queryToBreakpoint[query];
  if (!breakpoint) {
    throw new Error(
      `received unknown media query in breakpoint mock: '${query}'`,
    );
  }
  return breakpoint;
}

type Listener = (event: { matches: boolean }) => void;

interface QueryList {
  addListener(listener: Listener): void;
  removeListener(listener: Listener): void;
  matches: boolean;
}

interface Query {
  query: string;
  queryList: QueryList;
  listeners: Set<Listener>;
}

export default function mockBreakpoint(initialBreakpoint: Breakpoint = 'xl') {
  let currentBreakpoint = initialBreakpoint;
  const queries = Array<Query>();

  const previousMatchMedia: any = (window as any).matchMedia;

  (window as any).matchMedia = (query: string): QueryList => {
    const listeners = new Set<Listener>();

    const queryList: QueryList = {
      addListener(listener) {
        listeners.add(listener);
      },
      removeListener(listener) {
        listeners.delete(listener);
      },
      matches: toBreakpoint(query) === currentBreakpoint,
    };

    queries.push({ query, queryList, listeners });

    return queryList;
  };

  return {
    set(breakpoint: Breakpoint) {
      currentBreakpoint = breakpoint;

      act(() => {
        queries.forEach(({ query, queryList, listeners }) => {
          const matches = toBreakpoint(query) === breakpoint;
          queryList.matches = matches;
          listeners.forEach(listener => listener({ matches }));
        });
      });
    },
    remove() {
      (window as any).matchMedia = previousMatchMedia;
    },
  };
}
