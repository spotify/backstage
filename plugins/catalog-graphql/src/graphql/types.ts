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
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { ModuleContext } from '@graphql-modules/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  JSONObject: any;
};

export type EntityMetadata = {
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
};

export type EntityMetadataAnnotationArgs = {
  name: Scalars['String'];
};

export type EntityMetadataLabelArgs = {
  name: Scalars['String'];
};

export type DefaultEntityMetadata = EntityMetadata & {
  __typename?: 'DefaultEntityMetadata';
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
};

export type DefaultEntityMetadataAnnotationArgs = {
  name: Scalars['String'];
};

export type DefaultEntityMetadataLabelArgs = {
  name: Scalars['String'];
};

export type ComponentMetadata = EntityMetadata & {
  __typename?: 'ComponentMetadata';
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
  relationships?: Maybe<Scalars['String']>;
};

export type ComponentMetadataAnnotationArgs = {
  name: Scalars['String'];
};

export type ComponentMetadataLabelArgs = {
  name: Scalars['String'];
};

export type TemplateMetadata = EntityMetadata & {
  __typename?: 'TemplateMetadata';
  name: Scalars['String'];
  annotations: Scalars['JSONObject'];
  annotation?: Maybe<Scalars['JSON']>;
  labels: Scalars['JSONObject'];
  label?: Maybe<Scalars['JSON']>;
  uid: Scalars['String'];
  etag: Scalars['String'];
  generation: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
};

export type TemplateMetadataAnnotationArgs = {
  name: Scalars['String'];
};

export type TemplateMetadataLabelArgs = {
  name: Scalars['String'];
};

export type TemplateEntitySpec = {
  __typename?: 'TemplateEntitySpec';
  type: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  schema: Scalars['JSONObject'];
  templater: Scalars['String'];
};

export type ComponentEntitySpec = {
  __typename?: 'ComponentEntitySpec';
  title: Scalars['String'];
  lifecycle: Scalars['String'];
  owner: Scalars['String'];
};

export type LocationEntitySpec = {
  __typename?: 'LocationEntitySpec';
  type: Scalars['String'];
  target?: Maybe<Scalars['String']>;
  targets: Array<Scalars['String']>;
};

export type DefaultEntitySpec = {
  __typename?: 'DefaultEntitySpec';
  raw?: Maybe<Scalars['JSONObject']>;
};

export type EntitySpec =
  | DefaultEntitySpec
  | TemplateEntitySpec
  | LocationEntitySpec
  | ComponentEntitySpec;

export type CatalogEntity = {
  __typename?: 'CatalogEntity';
  apiVersion: Scalars['String'];
  kind: Scalars['String'];
  metadata?: Maybe<EntityMetadata>;
  spec: EntitySpec;
};

export type CatalogQuery = {
  __typename?: 'CatalogQuery';
  list: Array<CatalogEntity>;
};

export type Query = {
  __typename?: 'Query';
  catalog: CatalogQuery;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  JSON: ResolverTypeWrapper<Partial<Scalars['JSON']>>;
  JSONObject: ResolverTypeWrapper<Partial<Scalars['JSONObject']>>;
  EntityMetadata:
    | ResolversTypes['DefaultEntityMetadata']
    | ResolversTypes['ComponentMetadata']
    | ResolversTypes['TemplateMetadata'];
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  DefaultEntityMetadata: ResolverTypeWrapper<Partial<DefaultEntityMetadata>>;
  ComponentMetadata: ResolverTypeWrapper<Partial<ComponentMetadata>>;
  TemplateMetadata: ResolverTypeWrapper<Partial<TemplateMetadata>>;
  TemplateEntitySpec: ResolverTypeWrapper<Partial<TemplateEntitySpec>>;
  ComponentEntitySpec: ResolverTypeWrapper<Partial<ComponentEntitySpec>>;
  LocationEntitySpec: ResolverTypeWrapper<Partial<LocationEntitySpec>>;
  DefaultEntitySpec: ResolverTypeWrapper<Partial<DefaultEntitySpec>>;
  EntitySpec: Partial<
    | ResolversTypes['DefaultEntitySpec']
    | ResolversTypes['TemplateEntitySpec']
    | ResolversTypes['LocationEntitySpec']
    | ResolversTypes['ComponentEntitySpec']
  >;
  CatalogEntity: ResolverTypeWrapper<
    Partial<
      Omit<CatalogEntity, 'spec'> & { spec: ResolversTypes['EntitySpec'] }
    >
  >;
  CatalogQuery: ResolverTypeWrapper<Partial<CatalogQuery>>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  JSON: Partial<Scalars['JSON']>;
  JSONObject: Partial<Scalars['JSONObject']>;
  EntityMetadata:
    | ResolversParentTypes['DefaultEntityMetadata']
    | ResolversParentTypes['ComponentMetadata']
    | ResolversParentTypes['TemplateMetadata'];
  String: Partial<Scalars['String']>;
  Int: Partial<Scalars['Int']>;
  DefaultEntityMetadata: Partial<DefaultEntityMetadata>;
  ComponentMetadata: Partial<ComponentMetadata>;
  TemplateMetadata: Partial<TemplateMetadata>;
  TemplateEntitySpec: Partial<TemplateEntitySpec>;
  ComponentEntitySpec: Partial<ComponentEntitySpec>;
  LocationEntitySpec: Partial<LocationEntitySpec>;
  DefaultEntitySpec: Partial<DefaultEntitySpec>;
  EntitySpec: Partial<
    | ResolversParentTypes['DefaultEntitySpec']
    | ResolversParentTypes['TemplateEntitySpec']
    | ResolversParentTypes['LocationEntitySpec']
    | ResolversParentTypes['ComponentEntitySpec']
  >;
  CatalogEntity: Partial<
    Omit<CatalogEntity, 'spec'> & { spec: ResolversParentTypes['EntitySpec'] }
  >;
  CatalogQuery: Partial<CatalogQuery>;
  Query: {};
  Boolean: Partial<Scalars['Boolean']>;
}>;

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type EntityMetadataResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['EntityMetadata']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'DefaultEntityMetadata' | 'ComponentMetadata' | 'TemplateMetadata',
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<EntityMetadataAnnotationArgs, 'name'>
  >;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<EntityMetadataLabelArgs, 'name'>
  >;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type DefaultEntityMetadataResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['DefaultEntityMetadata']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<DefaultEntityMetadataAnnotationArgs, 'name'>
  >;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<DefaultEntityMetadataLabelArgs, 'name'>
  >;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ComponentMetadataResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['ComponentMetadata']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<ComponentMetadataAnnotationArgs, 'name'>
  >;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<ComponentMetadataLabelArgs, 'name'>
  >;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  relationships?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TemplateMetadataResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['TemplateMetadata']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  annotations?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  annotation?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<TemplateMetadataAnnotationArgs, 'name'>
  >;
  labels?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  label?: Resolver<
    Maybe<ResolversTypes['JSON']>,
    ParentType,
    ContextType,
    RequireFields<TemplateMetadataLabelArgs, 'name'>
  >;
  uid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  etag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generation?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedBy?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type TemplateEntitySpecResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['TemplateEntitySpec']
> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schema?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  templater?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type ComponentEntitySpecResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['ComponentEntitySpec']
> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lifecycle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type LocationEntitySpecResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['LocationEntitySpec']
> = ResolversObject<{
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  targets?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type DefaultEntitySpecResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['DefaultEntitySpec']
> = ResolversObject<{
  raw?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type EntitySpecResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['EntitySpec']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | 'DefaultEntitySpec'
    | 'TemplateEntitySpec'
    | 'LocationEntitySpec'
    | 'ComponentEntitySpec',
    ParentType,
    ContextType
  >;
}>;

export type CatalogEntityResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['CatalogEntity']
> = ResolversObject<{
  apiVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metadata?: Resolver<
    Maybe<ResolversTypes['EntityMetadata']>,
    ParentType,
    ContextType
  >;
  spec?: Resolver<ResolversTypes['EntitySpec'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type CatalogQueryResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['CatalogQuery']
> = ResolversObject<{
  list?: Resolver<
    Array<ResolversTypes['CatalogEntity']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
}>;

export type QueryResolvers<
  ContextType = ModuleContext,
  ParentType = ResolversParentTypes['Query']
> = ResolversObject<{
  catalog?: Resolver<ResolversTypes['CatalogQuery'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = ModuleContext> = ResolversObject<{
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  EntityMetadata?: EntityMetadataResolvers<ContextType>;
  DefaultEntityMetadata?: DefaultEntityMetadataResolvers<ContextType>;
  ComponentMetadata?: ComponentMetadataResolvers<ContextType>;
  TemplateMetadata?: TemplateMetadataResolvers<ContextType>;
  TemplateEntitySpec?: TemplateEntitySpecResolvers<ContextType>;
  ComponentEntitySpec?: ComponentEntitySpecResolvers<ContextType>;
  LocationEntitySpec?: LocationEntitySpecResolvers<ContextType>;
  DefaultEntitySpec?: DefaultEntitySpecResolvers<ContextType>;
  EntitySpec?: EntitySpecResolvers<ContextType>;
  CatalogEntity?: CatalogEntityResolvers<ContextType>;
  CatalogQuery?: CatalogQueryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
