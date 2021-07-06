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

export type DbLocationsRow = {
  id: string;
  type: string;
  target: string;
};

export type DbRefreshStateRow = {
  entity_id: string;
  entity_ref: string;
  unprocessed_entity: string;
  processed_entity?: string;
  cache?: string;
  next_update_at: string;
  last_discovery_at: string; // remove?
  errors?: string;
  location_key?: string;
};

export type DbRefreshStateReferencesRow = {
  source_key?: string;
  source_entity_ref?: string;
  target_entity_ref: string;
};

export type DbRelationsRow = {
  originating_entity_id: string;
  source_entity_ref: string;
  target_entity_ref: string;
  type: string;
};

export type DbFinalEntitiesRow = {
  entity_id: string;
  hash: string;
  stitch_ticket: string;
  final_entity?: string;
};

export type DbSearchRow = {
  entity_id: string;
  key: string;
  value: string | null;
};
