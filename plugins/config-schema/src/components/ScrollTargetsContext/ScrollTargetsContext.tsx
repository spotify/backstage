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

import React, { createContext, ReactNode, useContext } from 'react';

class ScrollTargetsForwarder {
  private readonly listeners = new Map<string, () => void>();

  setScrollListener(id: string, listener: () => void): () => void {
    this.listeners.set(id, listener);

    return () => {
      if (this.listeners.get(id) === listener) {
        this.listeners.delete(id);
      }
    };
  }

  scrollTo(id: string) {
    this.listeners.get(id)?.();
  }
}

const ScrollTargetsContext = createContext<ScrollTargetsForwarder | undefined>(
  undefined,
);

export function ScrollTargetsProvider({ children }: { children: ReactNode }) {
  return (
    <ScrollTargetsContext.Provider
      value={new ScrollTargetsForwarder()}
      children={children}
    />
  );
}

export function useScrollTargets() {
  return useContext(ScrollTargetsContext);
}
