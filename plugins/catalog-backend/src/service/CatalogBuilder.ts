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

import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import {
  DefaultNamespaceEntityPolicy,
  EntityPolicies,
  EntityPolicy,
  FieldFormatEntityPolicy,
  makeValidator,
  NoForeignRootFieldsEntityPolicy,
  SchemaValidEntityPolicy,
  Validators,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import lodash from 'lodash';
import { Logger } from 'winston';
import {
  DatabaseEntitiesCatalog,
  DatabaseLocationsCatalog,
  EntitiesCatalog,
  LocationsCatalog,
} from '../catalog';
import { DatabaseManager } from '../database';
import {
  AnnotateLocationEntityProcessor,
  BitbucketDiscoveryProcessor,
  BuiltinKindsEntityProcessor,
  CatalogProcessor,
  CatalogProcessorParser,
  CodeOwnersProcessor,
  FileReaderProcessor,
  GithubDiscoveryProcessor,
  GithubOrgReaderProcessor,
  HigherOrderOperation,
  HigherOrderOperations,
  LocationEntityProcessor,
  LocationReaders,
  PlaceholderProcessor,
  PlaceholderResolver,
  StaticLocationProcessor,
  UrlReaderProcessor,
} from '../ingestion';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { RepoLocationAnalyzer } from '../ingestion/LocationAnalyzer';
import {
  jsonPlaceholderResolver,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from '../ingestion/processors/PlaceholderProcessor';
import { defaultEntityDataParser } from '../ingestion/processors/util/parse';
import { LocationAnalyzer } from '../ingestion/types';
import { NextCatalogBuilder } from '../next';

export type CatalogEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  reader: UrlReader;
};

/**
 * A builder that helps wire up all of the component parts of the catalog.
 *
 * The touch points where you can replace or extend behavior are as follows:
 *
 * - Entity policies can be added or replaced. These are automatically run
 *   after the processors' pre-processing steps. All policies are given the
 *   chance to inspect the entity, and all of them have to pass in order for
 *   the entity to be considered valid from an overall point of view.
 * - Placeholder resolvers can be replaced or added. These run on the raw
 *   structured data between the parsing and pre-processing steps, to replace
 *   dollar-prefixed entries with their actual values (like $file).
 * - Field format validators can be replaced. These check the format of
 *   individual core fields such as metadata.name, to ensure that they adhere
 *   to certain rules.
 * - Processors can be added or replaced. These implement the functionality of
 *   reading, parsing, validating, and processing the entity data before it is
 *   persisted in the catalog.
 */
export class CatalogBuilder {
  private readonly env: CatalogEnvironment;
  private entityPolicies: EntityPolicy[];
  private entityPoliciesReplace: boolean;
  private placeholderResolvers: Record<string, PlaceholderResolver>;
  private fieldFormatValidators: Partial<Validators>;
  private processors: CatalogProcessor[];
  private processorsReplace: boolean;
  private parser: CatalogProcessorParser | undefined;

  static async create(env: CatalogEnvironment): Promise<NextCatalogBuilder> {
    return new NextCatalogBuilder(env);
  }

  constructor(env: CatalogEnvironment) {
    this.env = env;
    this.entityPolicies = [];
    this.entityPoliciesReplace = false;
    this.placeholderResolvers = {};
    this.fieldFormatValidators = {};
    this.processors = [];
    this.processorsReplace = false;
    this.parser = undefined;

    env.logger.warn(
      "Creating the catalog with 'new CatalogBuilder(env)' is deprecated! Use CatalogBuilder.create(env) instead",
    );
  }

  /**
   * Adds policies that are used to validate entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBuilder#setFieldFormatValidators} instead.
   *
   * @param policies One or more policies
   */
  addEntityPolicy(...policies: EntityPolicy[]): CatalogBuilder {
    this.entityPolicies.push(...policies);
    return this;
  }

  /**
   * Sets what policies to use for validation of entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBuilder#setFieldFormatValidators} instead.
   *
   * This function replaces the default set of policies; use with care.
   *
   * @param policies One or more policies
   */
  replaceEntityPolicies(policies: EntityPolicy[]): CatalogBuilder {
    this.entityPolicies = [...policies];
    this.entityPoliciesReplace = true;
    return this;
  }

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key The key that identifies the placeholder, e.g. "file"
   * @param resolver The resolver that gets values for this placeholder
   */
  setPlaceholderResolver(
    key: string,
    resolver: PlaceholderResolver,
  ): CatalogBuilder {
    this.placeholderResolvers[key] = resolver;
    return this;
  }

  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * This function has no effect if used together with
   * {@link CatalogBuilder#replaceEntityPolicies}.
   *
   * @param validators The (subset of) validators to set
   */
  setFieldFormatValidators(validators: Partial<Validators>): CatalogBuilder {
    lodash.merge(this.fieldFormatValidators, validators);
    return this;
  }

  /**
   * Adds entity processors. These are responsible for reading, parsing, and
   * processing entities before they are persisted in the catalog.
   *
   * @param processors One or more processors
   */
  addProcessor(...processors: CatalogProcessor[]): CatalogBuilder {
    this.processors.push(...processors);
    return this;
  }

  /**
   * Sets what entity processors to use. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog.
   *
   * This function replaces the default set of processors; use with care.
   *
   * @param processors One or more processors
   */
  replaceProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.processors = [...processors];
    this.processorsReplace = true;
    return this;
  }

  /**
   * Sets up the catalog to use a custom parser for entity data.
   *
   * This is the function that gets called immediately after some raw entity
   * specification data has been read from a remote source, and needs to be
   * parsed and emitted as structured data.
   *
   * @param parser The custom parser
   */
  setEntityDataParser(parser: CatalogProcessorParser): CatalogBuilder {
    this.parser = parser;
    return this;
  }

  /**
   * Wires up and returns all of the component parts of the catalog
   */
  async build(): Promise<{
    entitiesCatalog: EntitiesCatalog;
    locationsCatalog: LocationsCatalog;
    higherOrderOperation: HigherOrderOperation;
    locationAnalyzer: LocationAnalyzer;
  }> {
    const { config, database, logger } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    const policy = this.buildEntityPolicy();
    const processors = this.buildProcessors();
    const rulesEnforcer = CatalogRulesEnforcer.fromConfig(config);
    const parser = this.parser || defaultEntityDataParser;

    const locationReader = new LocationReaders({
      ...this.env,
      parser,
      processors,
      rulesEnforcer,
      policy,
    });

    const db = await DatabaseManager.createDatabase(
      await database.getClient(),
      { logger },
    );

    const entitiesCatalog = new DatabaseEntitiesCatalog(db, this.env.logger);
    const locationsCatalog = new DatabaseLocationsCatalog(db);
    const higherOrderOperation = new HigherOrderOperations(
      entitiesCatalog,
      locationsCatalog,
      locationReader,
      logger,
    );
    const locationAnalyzer = new RepoLocationAnalyzer(logger, integrations);

    return {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer,
    };
  }

  private buildEntityPolicy(): EntityPolicy {
    const entityPolicies: EntityPolicy[] = this.entityPoliciesReplace
      ? [new SchemaValidEntityPolicy(), ...this.entityPolicies]
      : [
          new SchemaValidEntityPolicy(),
          new DefaultNamespaceEntityPolicy(),
          new NoForeignRootFieldsEntityPolicy(),
          new FieldFormatEntityPolicy(
            makeValidator(this.fieldFormatValidators),
          ),
          ...this.entityPolicies,
        ];

    return EntityPolicies.allOf(entityPolicies);
  }

  private buildProcessors(): CatalogProcessor[] {
    const { config, logger, reader } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    this.checkDeprecatedReaderProcessors();

    const placeholderResolvers: Record<string, PlaceholderResolver> = {
      json: jsonPlaceholderResolver,
      yaml: yamlPlaceholderResolver,
      text: textPlaceholderResolver,
      ...this.placeholderResolvers,
    };

    // These are always there no matter what
    const processors: CatalogProcessor[] = [
      StaticLocationProcessor.fromConfig(config),
      new PlaceholderProcessor({ resolvers: placeholderResolvers, reader }),
      new BuiltinKindsEntityProcessor(),
    ];

    // These are only added unless the user replaced them all
    if (!this.processorsReplace) {
      processors.push(
        new FileReaderProcessor(),
        BitbucketDiscoveryProcessor.fromConfig(config, { logger }),
        GithubDiscoveryProcessor.fromConfig(config, { logger }),
        GithubOrgReaderProcessor.fromConfig(config, { logger }),
        new UrlReaderProcessor({ reader, logger }),
        CodeOwnersProcessor.fromConfig(config, { logger, reader }),
        new LocationEntityProcessor({ integrations }),
        new AnnotateLocationEntityProcessor({ integrations }),
      );
    }

    // Add the ones (if any) that the user added
    processors.push(...this.processors);

    return processors;
  }

  // TODO(Rugvip): These old processors are removed, for a while we'll be throwing
  //               errors here to make sure people know where to move the config
  private checkDeprecatedReaderProcessors() {
    const pc = this.env.config.getOptionalConfig('catalog.processors');
    if (pc?.has('github')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.github, move to using integrations.github instead`,
      );
    }
    if (pc?.has('gitlabApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.gitlabApi, move to using integrations.gitlab instead`,
      );
    }
    if (pc?.has('bitbucketApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.bitbucketApi, move to using integrations.bitbucket instead`,
      );
    }
    if (pc?.has('azureApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.azureApi, move to using integrations.azure instead`,
      );
    }
  }
}
