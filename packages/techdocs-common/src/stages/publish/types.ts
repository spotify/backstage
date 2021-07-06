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
import { Entity, EntityName } from '@backstage/catalog-model';
import express from 'express';

/**
 * Key for all the different types of TechDocs publishers that are supported.
 */
export type PublisherType =
  | 'local'
  | 'googleGcs'
  | 'awsS3'
  | 'azureBlobStorage'
  | 'openStackSwift';

export type PublishRequest = {
  entity: Entity;
  /* The Path to the directory where the generated files are stored. */
  directory: string;
};

/* `remoteUrl` is the URL which serves files from the local publisher's static directory. */
export type PublishResponse = {
  remoteUrl?: string;
} | void;

/**
 * Result for the validation check.
 */
export type ReadinessResponse = {
  /** If true, the publisher is able to interact with the backing storage. */
  isAvailable: boolean;
};

/**
 * Type to hold metadata found in techdocs_metadata.json and associated with each site
 * @param etag ETag of the resource used to generate the site. Usually the latest commit sha of the source repository.
 */
export type TechDocsMetadata = {
  site_name: string;
  site_description: string;
  etag: string;
};

/**
 * Base class for a TechDocs publisher (e.g. Local, Google GCS Bucket, AWS S3, etc.)
 * The publisher handles publishing of the generated static files after the prepare and generate steps of TechDocs.
 * It also provides APIs to communicate with the storage service.
 */
export interface PublisherBase {
  /**
   * Check if the publisher is ready. This check tries to perform certain checks to see if the
   * publisher is configured correctly and can be used to publish or read documentations.
   * The different implementations might e.g. use the provided service credentials to access the
   * target or check if a folder/bucket is available.
   */
  getReadiness(): Promise<ReadinessResponse>;

  /**
   * Store the generated static files onto a storage service (either local filesystem or external service).
   *
   * @param request Object containing the entity from the service
   * catalog, and the directory that contains the generated static files from TechDocs.
   */
  publish(request: PublishRequest): Promise<PublishResponse>;

  /**
   * Retrieve TechDocs Metadata about a site e.g. name, contributors, last updated, etc.
   * This API uses the techdocs_metadata.json file that co-exists along with the generated docs.
   */
  fetchTechDocsMetadata(entityName: EntityName): Promise<TechDocsMetadata>;

  /**
   * Route middleware to serve static documentation files for an entity.
   */
  docsRouter(): express.Handler;

  /**
   * Check if the index.html is present for the Entity at the Storage location.
   */
  hasDocsBeenGenerated(entityName: Entity): Promise<boolean>;
}
