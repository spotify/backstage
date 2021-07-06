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

// Entity uid: unix timestamp
const lastUpdatedRecord = {} as Record<string, number>;

/**
 * Store timestamps of the most recent TechDocs update of each Entity. This is
 * used to avoid checking for an update on each and every request to TechDocs.
 */
export class BuildMetadataStorage {
  private entityUid: string;
  private lastUpdatedRecord: Record<string, number>;

  constructor(entityUid: string) {
    this.entityUid = entityUid;
    this.lastUpdatedRecord = lastUpdatedRecord;
  }

  setLastUpdated(): void {
    this.lastUpdatedRecord[this.entityUid] = Date.now();
  }

  getLastUpdated(): number | undefined {
    return this.lastUpdatedRecord[this.entityUid];
  }
}

/**
 * Return false if a check for update has happened in last 60 seconds.
 */
export const shouldCheckForUpdate = (entityUid: string) => {
  const lastUpdated = new BuildMetadataStorage(entityUid).getLastUpdated();
  if (lastUpdated) {
    // The difference is in milliseconds
    if (Date.now() - lastUpdated < 60 * 1000) {
      return false;
    }
  }
  return true;
};
