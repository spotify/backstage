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
import React, { useEffect, useRef } from 'react';
import { ScrollTo, useScroll } from '../hooks/useScroll';

/*
  Utility component use in conjuction with useScroll that allows scrollable components to control behavior and offset.
  1. ScrollAnchor must be a direct child of a scrollable component.
  2. ScrollAnchor's parent position must be relative. 
  3. ScrollAnchor's id must be unique.
*/

export interface ScrollAnchorProps extends ScrollIntoViewOptions {
  id: ScrollTo;
  top?: number;
  left?: number;
}

export const ScrollAnchor = ({
  id,
  left = 0,
  top = -20,
  block = 'start',
  inline = 'nearest',
  behavior = 'smooth',
}: ScrollAnchorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useScroll();

  useEffect(() => {
    function scrollIntoView() {
      if (divRef.current && scroll === id) {
        divRef.current.scrollIntoView({
          block,
          inline,
          behavior,
        });
        setScroll(null);
      }
    }

    scrollIntoView();
  }, [scroll, setScroll, id, behavior, block, inline]);

  return (
    <div
      ref={divRef}
      style={{ position: 'absolute', height: 0, width: 0, top, left }}
      data-testid={`scroll-test-${id}`}
    />
  );
};
