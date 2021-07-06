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

// For testing with Jest and JSDOM
// SVGGElement.prototype.getBBox to calculate boundaries.
// JSDOM doesn't support this: https://github.com/jsdom/jsdom/issues/1664
class GetBBoxPolyfill {
  static exists(): boolean {
    // @ts-ignore
    return typeof window.Element.prototype.getBBox !== 'undefined';
  }

  static create(
    x: number = 0,
    y: number = 0,
    width: number = 1000,
    height: number = 500,
  ): void {
    if (this.exists()) {
      return;
    }

    Object.defineProperty(window.Element.prototype, 'getBBox', {
      writable: false,
      value: () => ({ x, y, width, height }),
    });
  }

  static remove(): void {
    if (!this.exists()) {
      return;
    }

    // @ts-ignore
    delete window.Element.prototype.getBBox;
  }
}

export default GetBBoxPolyfill;
