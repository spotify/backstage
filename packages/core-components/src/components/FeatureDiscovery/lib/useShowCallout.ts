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

import { useCallback, useState } from 'react';

const STATES_LOCAL_STORAGE_KEY = 'core.calloutSeen';

function useCalloutStates(): {
  states: Record<string, boolean>;
  setState: (key: string, value: boolean) => void;
} {
  const [states, setStates] = useState<Record<string, boolean>>(() => {
    const raw = localStorage.getItem(STATES_LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  });

  const setState = useCallback((key: string, value: boolean) => {
    const raw = localStorage.getItem(STATES_LOCAL_STORAGE_KEY);
    const oldStates = raw ? JSON.parse(raw) : {};
    const newStates = { ...oldStates, [key]: value };
    setStates(newStates);
    localStorage.setItem(STATES_LOCAL_STORAGE_KEY, JSON.stringify(newStates));
  }, []);

  return { states, setState };
}

function useCalloutHasBeenSeen(
  featureId: string,
): { seen: boolean | undefined; markSeen: () => void } {
  const { states, setState } = useCalloutStates();

  const markSeen = useCallback(() => {
    setState(featureId, true);
  }, [setState, featureId]);

  return { seen: states[featureId] === true, markSeen };
}

export function useShowCallout(
  featureId: string,
): { show: boolean; hide: () => void } {
  const { seen, markSeen } = useCalloutHasBeenSeen(featureId);
  return { show: seen === false, hide: markSeen };
}
