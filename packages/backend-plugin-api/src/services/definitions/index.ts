/*
 * Copyright 2022 The Backstage Authors
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
export type {
  AuditorService,
  AuditorServiceCreateEventOptions,
  AuditorServiceEvent,
  AuditorServiceEventSeverityLevel,
} from './AuditorService';
export type {
  AuthService,
  BackstageCredentials,
  BackstageNonePrincipal,
  BackstagePrincipalAccessRestrictions,
  BackstagePrincipalTypes,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
} from './AuthService';
export type {
  CacheService,
  CacheServiceOptions,
  CacheServiceSetOptions,
} from './CacheService';
export type { DatabaseService } from './DatabaseService';
export type { DiscoveryService } from './DiscoveryService';
export type { HttpAuthService } from './HttpAuthService';
export type {
  HttpRouterService,
  HttpRouterServiceAuthPolicy,
  HttpRouterServiceWebSocketHandler,
  HttpRouterServiceWebSocketOptions,
  HttpRouterServiceWebSocketContext,
} from './HttpRouterService';
export type {
  LifecycleService,
  LifecycleServiceShutdownHook,
  LifecycleServiceShutdownOptions,
  LifecycleServiceStartupHook,
  LifecycleServiceStartupOptions,
} from './LifecycleService';
export type { LoggerService } from './LoggerService';
export type {
  PermissionsService,
  PermissionsServiceRequestOptions,
} from './PermissionsService';
export type {
  PermissionsRegistryService,
  PermissionsRegistryServiceAddResourceTypeOptions,
} from './PermissionsRegistryService';
export type { PluginMetadataService } from './PluginMetadataService';
export type { RootConfigService } from './RootConfigService';
export type { RootHealthService } from './RootHealthService';
export type {
  RootHttpRouterService,
  RootHttpRouterServiceWebSocketOptions,
} from './RootHttpRouterService';
export type { RootLifecycleService } from './RootLifecycleService';
export type { RootLoggerService } from './RootLoggerService';
export { readSchedulerServiceTaskScheduleDefinitionFromConfig } from './SchedulerService';
export type {
  SchedulerService,
  SchedulerServiceTaskDescriptor,
  SchedulerServiceTaskFunction,
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
  SchedulerServiceTaskScheduleDefinitionConfig,
} from './SchedulerService';
export type {
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadTreeResponseDirOptions,
  UrlReaderServiceReadTreeResponseFile,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
  UrlReaderServiceSearchResponseFile,
} from './UrlReaderService';
export type { BackstageUserInfo, UserInfoService } from './UserInfoService';
export type {
  RootInstanceMetadataService,
  RootInstanceMetadataServicePluginInfo,
} from './RootInstanceMetadataService';
export type {
  RootSystemMetadataService,
  RootSystemMetadataServicePluginInfo,
} from './RootSystemMetadataService';
export { coreServices } from './coreServices';
