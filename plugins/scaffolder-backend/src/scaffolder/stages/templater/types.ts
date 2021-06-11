/*
 * Copyright 2020 Spotify AB
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

import gitUrlParse from 'git-url-parse';
import type { Writable } from 'stream';

/**
 * Currently the required template values. The owner
 * and where to store the result from templating
 */
export type RequiredTemplateValues = {
  owner: string;
  storePath: string;
  destination?: {
    git?: gitUrlParse.GitUrl;
  };
};

export type TemplaterValues = RequiredTemplateValues & Record<string, any>;

/**
 * The returned directory from the templater which is ready
 * to pass to the next stage of the scaffolder which is publishing
 */
export type TemplaterRunResult = {
  resultDir: string;
};

/**
 * The values that the templater will receive. The directory of the
 * skeleton, with the values from the frontend. A dedicated log stream and a docker
 * client to run any templater on top of your directory.
 */
export type TemplaterRunOptions = {
  workspacePath: string;
  values: TemplaterValues;
  logStream?: Writable;
};

export type TemplaterBase = {
  // runs the templating with the values and returns the directory to push the VCS
  run(opts: TemplaterRunOptions): Promise<void>;
};

export type TemplaterConfig = {
  templater?: TemplaterBase;
};

/**
 * List of supported templating options
 */
export type SupportedTemplatingKey = 'cookiecutter' | string;

/**
 * The templater builder holds the templaters ready for run time
 */
export type TemplaterBuilder = {
  register(protocol: SupportedTemplatingKey, templater: TemplaterBase): void;
  get(templater: string): TemplaterBase;
};
