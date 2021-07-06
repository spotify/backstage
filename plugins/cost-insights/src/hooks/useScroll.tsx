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
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';
import { Maybe } from '../types';

export type ScrollTo = Maybe<string>;

export type ScrollContextProps = {
  scroll: ScrollTo;
  setScroll: Dispatch<SetStateAction<ScrollTo>>;
};

export const ScrollContext = React.createContext<
  ScrollContextProps | undefined
>(undefined);

export const ScrollProvider = ({ children }: PropsWithChildren<{}>) => {
  const [scroll, setScroll] = useState<ScrollTo>(null);
  return (
    <ScrollContext.Provider value={{ scroll, setScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};

export enum ScrollType {
  AlertSummary = 'alert-status-summary',
}

export function useScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    assertNever();
  }

  return [context.scroll, context.setScroll] as const;
}

function assertNever(): never {
  throw new Error(`Cannot use useScroll outside ScrollProvider`);
}
