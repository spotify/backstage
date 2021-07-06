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

import { posix, win32 } from 'path';

describe('isChildPath', () => {
  it('should check child posix paths', () => {
    jest.isolateModules(() => {
      jest.setMock('path', posix);
      const { isChildPath } = require('./isChildPath');

      expect(isChildPath('/', '/')).toBe(true);
      expect(isChildPath('/x', '/x')).toBe(true);
      expect(isChildPath('/x', '/x/y')).toBe(true);
      expect(isChildPath('/x', '/x/x')).toBe(true);
      expect(isChildPath('/x', '/x/y/z')).toBe(true);
      expect(isChildPath('/x/y', '/x/y/z')).toBe(true);
      expect(isChildPath('/x/y/z', '/x/y/z')).toBe(true);
      expect(isChildPath('/x/a b c/z', '/x/a b c/z')).toBe(true);
      expect(isChildPath('/', '/ yz')).toBe(true);

      expect(isChildPath('/x', '/y')).toBe(false);
      expect(isChildPath('/x', '/')).toBe(false);
      expect(isChildPath('/x', '/x y')).toBe(false);
      expect(isChildPath('/x y', '/x yz')).toBe(false);
      expect(isChildPath('/ yz', '/')).toBe(false);
      expect(isChildPath('/x', '/')).toBe(false);

      jest.dontMock('path');
    });
  });

  it('should check child win32 paths', () => {
    jest.isolateModules(() => {
      jest.setMock('path', win32);
      const { isChildPath } = require('./isChildPath');

      expect(isChildPath('/x', '/x')).toBe(true);
      expect(isChildPath('/x', '/x/y')).toBe(true);
      expect(isChildPath('/x', '/x/x')).toBe(true);
      expect(isChildPath('/x', '/x/y/z')).toBe(true);
      expect(isChildPath('/x/y', '/x/y/z')).toBe(true);
      expect(isChildPath('/x/y/z', '/x/y/z')).toBe(true);
      expect(isChildPath('Z:', 'Z:')).toBe(true);
      expect(isChildPath('C:/', 'c:/')).toBe(true);
      expect(isChildPath('C:/x', 'C:/x')).toBe(true);
      expect(isChildPath('C:/x', 'c:/x')).toBe(true);
      expect(isChildPath('C:/x', 'C:/x/y')).toBe(true);
      expect(isChildPath('d:/x', 'D:/x/y')).toBe(true);

      expect(isChildPath('/x', '/y')).toBe(false);
      expect(isChildPath('/x', '/')).toBe(false);
      expect(isChildPath('C:/', 'D:/')).toBe(false);
      expect(isChildPath('C:/x', 'D:/x')).toBe(false);
      expect(isChildPath('D:/x', 'CD:/x')).toBe(false);
      expect(isChildPath('D:/x', 'D:/y')).toBe(false);

      jest.dontMock('path');
    });
  });
});
