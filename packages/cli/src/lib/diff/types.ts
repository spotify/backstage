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

export type WriteFileFunc = (contents: string) => Promise<void>;

export type FileDiff = {
  // Relative path within the target directory
  path: string;
  // Wether the target file exists in the target directory.
  missing: boolean;
  // Contents of the file in the target directory, or an empty string if the file is missing.
  targetContents: string;
  // Contents of the compiled template file
  templateContents: string;
  // Write new contents to the target file
  write: WriteFileFunc;
};

export type PromptFunc = (msg: string) => Promise<boolean>;

export type HandlerFunc = (file: FileDiff, prompt: PromptFunc) => Promise<void>;

export type FileHandler = {
  patterns: Array<string | RegExp>;
  handler: HandlerFunc;
};
