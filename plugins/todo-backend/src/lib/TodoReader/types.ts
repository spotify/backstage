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

export type TodoItem = {
  /** The contents of the TODO comment */
  text: string;

  /** The tag used, e.g. TODO, FIXME */
  tag: string;

  /** References author, if any */
  author?: string;

  /** URL used to view the file */
  viewUrl?: string;

  /** The line number of the file that the TODO occurs at */
  lineNumber?: number;

  /** The path of the file containing the TODO within the repo */
  repoFilePath?: string;
};

export type ReadTodosOptions = {
  /**
   * Base URLs defining the root at which to search for TODOs
   */
  url: string;
};

export type ReadTodosResult = {
  /**
   * TODO items found at the given locations
   */
  items: TodoItem[];
};

export interface TodoReader {
  /**
   * Searches for TODO items in code at a given location
   */
  readTodos(options: ReadTodosOptions): Promise<ReadTodosResult>;
}

type TodoParserContext = {
  content: string;
  path: string;
};

type TodoParserResult = {
  text: string;
  tag: string;
  author?: string;
  lineNumber: number;
};

export type TodoParser = (ctx: TodoParserContext) => TodoParserResult[];
