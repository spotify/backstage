/*
 * Copyright 2025 The Backstage Authors
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
  ActionsRegistryService,
  ActionsRegistryActionOptions,
  ActionsRegistryActionContext,
  ActionsRegistryActionExample,
  ActionUi,
  ActionUiMetadata,
} from './ActionsRegistryService';

export type { ActionsService, ActionsServiceAction } from './ActionsService';

export type {
  MetricsService,
  MetricAdvice,
  MetricAttributes,
  MetricAttributeValue,
  MetricOptions,
  MetricsServiceCounter,
  MetricsServiceUpDownCounter,
  MetricsServiceHistogram,
  MetricsServiceGauge,
  MetricsServiceObservable,
  MetricsServiceObservableCallback,
  MetricsServiceObservableCounter,
  MetricsServiceObservableGauge,
  MetricsServiceObservableResult,
  MetricsServiceObservableUpDownCounter,
} from './MetricsService';

export type {
  TracingService,
  TracingServiceAttributeValue,
  TracingServiceAttributes,
  TracingServiceBaggage,
  TracingServiceBaggageEntry,
  TracingServiceContext,
  TracingServiceContextAPI,
  TracingServicePropagationAPI,
  TracingServiceSpan,
  TracingServiceSpanKind,
  TracingServiceSpanOptions,
  TracingServiceSpanStatus,
} from './TracingService';

export {
  actionsRegistryServiceRef,
  actionsServiceRef,
  metricsServiceRef,
  tracingServiceRef,
  connectionsServiceRef,
} from './refs';

export type { ConnectionRegistration } from '../wiring/types';
export { declareConnection } from './declareConnection';
