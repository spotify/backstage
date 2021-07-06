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

import { createTodoParser } from './createTodoParser';

const comment = '//'; // just so we don't have all of these should up as TODOs :D

describe('createTodoParser', () => {
  it('should create a parser that parses TODOs', () => {
    const parser = createTodoParser();

    const output = parser({
      path: 'my-file.js',
      content: `
      ${comment} TODO(user1): todo 1
      ${comment}TODO(user2): todo 2
      ${comment}todo: todo 3
      ${comment}@todo: todo 4

      ${comment}@fixme(user5): todo 5
      ${comment} @TODO: todo 6 /user6
      ${comment} FIXME: todo 7 /user7
    `,
    });
    expect(output).toEqual([
      {
        text: 'todo 1',
        author: 'user1',
        lineNumber: 2,
        tag: 'TODO',
      },
      {
        text: 'todo 2',
        author: 'user2',
        lineNumber: 3,
        tag: 'TODO',
      },
      {
        text: 'todo 3',
        lineNumber: 4,
        tag: 'TODO',
      },
      {
        text: 'todo 4',
        lineNumber: 5,
        tag: 'TODO',
      },
      {
        text: 'todo 5',
        author: 'user5',
        lineNumber: 7,
        tag: 'FIXME',
      },
      {
        text: 'todo 6',
        author: 'user6',
        lineNumber: 8,
        tag: 'TODO',
      },
      {
        text: 'todo 7',
        author: 'user7',
        lineNumber: 9,
        tag: 'FIXME',
      },
    ]);
  });

  it('should support custom tags', () => {
    const content = `
      ${comment} TODO: todo 1
      ${comment} MYTAG: todo 2
      ${comment} MYTAG(user): todo 3
    `;
    expect(
      createTodoParser()({
        path: 'my-file.js',
        content,
      }),
    ).toEqual([{ text: 'todo 1', tag: 'TODO', lineNumber: 2 }]);
    expect(
      createTodoParser({ additionalTags: ['MYTAG'] })({
        path: 'my-file.js',
        content,
      }),
    ).toEqual([
      { text: 'todo 1', tag: 'TODO', lineNumber: 2 },
      { text: 'todo 2', tag: 'MYTAG', lineNumber: 3 },
      { text: 'todo 3', author: 'user', tag: 'MYTAG', lineNumber: 4 },
    ]);
  });

  it('should support multiple languages', () => {
    const parser = createTodoParser();

    const content = `
      -- TODO: todo 1
      # TODO: todo 2
      ${comment} TODO: todo 3
      ${comment[0]}* TODO: todo 4 */
    `;
    const todo1 = { text: 'todo 1', tag: 'TODO', lineNumber: 2 };
    const todo2 = { text: 'todo 2', tag: 'TODO', lineNumber: 3 };
    const todo3 = { text: 'todo 3', tag: 'TODO', lineNumber: 4 };
    const todo4 = { text: 'todo 4', tag: 'TODO', lineNumber: 5 };

    expect(parser({ path: 'f.py', content })).toEqual([todo2]);
    expect(parser({ path: 'f.lua', content })).toEqual([todo1]);
    expect(parser({ path: 'f.java', content })).toEqual([todo3, todo4]);
    expect(parser({ path: 'f.sh', content })).toEqual([todo2]);
    expect(parser({ path: 'f.sql', content })).toEqual([todo1, todo3, todo4]);
    expect(parser({ path: 'f.json', content })).toEqual([]);
  });
});
