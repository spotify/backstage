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
import { useRef } from 'react';

export const useAsyncPolling = (
  pollingFn: () => Promise<any>,
  interval: number,
) => {
  const isPolling = useRef<boolean>(false);
  const startPolling = async () => {
    if (isPolling.current === true) return;
    isPolling.current = true;

    while (isPolling.current === true) {
      await pollingFn();
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  const stopPolling = () => {
    isPolling.current = false;
  };
  return { startPolling, stopPolling };
};
