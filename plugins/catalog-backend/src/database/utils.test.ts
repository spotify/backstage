/*
 * Copyright 2021 Spotify AB
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
import { generateAttachmentEtag } from './utils';

describe('generateAttachmentEtag', () => {
  it('should generate stable etag', () => {
    const buffer = Buffer.from('Hello World');
    expect(generateAttachmentEtag(buffer, 'text/plain')).toEqual(
      'EAT0d0ctWMREHR8j9pp7TjTWNh7/UilaEjqh8cNWMcs=',
    );
  });

  it('changing data should change etag', () => {
    const buffer = Buffer.from('Hallo Welt');
    expect(generateAttachmentEtag(buffer, 'text/plain')).toEqual(
      'jCCaQrktTdmyQmaRpwrdvH8ixr8+v5I8/H2W9o7Z3iA=',
    );
  });

  it('changing content type should change etag', () => {
    const buffer = Buffer.from('Hello World');
    expect(generateAttachmentEtag(buffer, 'application/json')).toEqual(
      'X4mJrhwvCjyxLfx4KmBBaohcjXB2w/qomM/xcZt4ExM=',
    );
  });
});
