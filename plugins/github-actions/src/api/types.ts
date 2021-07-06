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

export type Step = {
  name: string;
  status: string;
  conclusion?: string;
  number: number; // starts from 1
  started_at: string;
  completed_at: string;
};

export type Job = {
  html_url: string;
  status: string;
  conclusion: string;
  started_at: string;
  completed_at: string;
  id: number;
  name: string;
  steps: Step[];
};

export type Jobs = {
  total_count: number;
  jobs: Job[];
};

export enum BuildStatus {
  'success',
  'failure',
  'pending',
  'running',
}
