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

/**
 * The envelope skeleton parts of an entity - whatever is necessary to be able
 * to give it a ref and pass to further validation / policy checking.
 *
 * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
 */
export type EntityEnvelope = {
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: {
    /**
     * The name of the entity.
     *
     * Must be unique within the catalog at any given point in time, for any
     * given namespace + kind pair.
     */
    name: string;

    /**
     * The namespace that the entity belongs to.
     */
    namespace?: string;
  };
};
