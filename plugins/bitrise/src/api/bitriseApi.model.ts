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

export type BitriseApp = {
  title: string;
  slug: string;
};

export type BitriseBuildArtifact = {
  slug: string;
  title: string;
  artifact_type: string;
};

export type BitriseBuildArtifactDetails = {
  slug: string;
  title: string;
  artifact_type: string;
  public_install_page_url: string;
  expiring_download_url: string;
};

export interface BitriseBuildResponseItem {
  abort_reason: string;
  branch: string;
  build_number: number;
  commit_hash: string;
  commit_message: string;
  commit_view_url: string;
  environment_prepare_finished_at: string;
  finished_at: string;
  is_on_hold: true;
  machine_type_id: string;
  original_build_params: string;
  pull_request_id: number;
  pull_request_target_branch: string;
  pull_request_view_url: string;
  slug: string;
  stack_identifier: string;
  started_on_worker_at: string;
  status: number;
  status_text: string;
  tag: string;
  triggered_at: string;
  triggered_by: string;
  triggered_workflow: string;
}

// not finished (0), successful (1), failed (2), aborted with failure (3), aborted with success (4)
export enum BitriseBuildResultStatus {
  notFinished,
  successful,
  failed,
  abortedWithFailure,
  abortedWithSuccess,
}

export interface BitriseBuildResult {
  id: number;
  source: string;
  status: BitriseBuildResultStatus;
  statusText: string;
  buildSlug: string;
  message: string;
  workflow: string;
  commitHash: string;
  triggerTime: string;
  duration: string;
  appSlug: string;
}

export interface BitriseQueryParams {
  workflow: string;
  branch?: string;
  limit?: number;
  next?: string;
}

export interface BitriseBuildListResponse {
  data: BitriseBuildResult[];
  paging?: BitrisePagingResponse;
}

export interface BitrisePagingResponse {
  /**
   * Slug of the first build in the next page, `undefined` if there are no more results.
   */
  next: string;

  /**
   * Max number of elements per page (default: 50)
   */
  page_item_limit: number;

  total_item_count: number;
}
