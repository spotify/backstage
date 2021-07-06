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

import React from 'react';
import pluralize from 'pluralize';
import { KubernetesMigrationAlertCard } from '../components';
import { CostInsightsApi } from '../../api';
import {
  Alert,
  AlertForm,
  AlertOptions,
  AlertStatus,
  AlertSnoozeFormData,
  ChangeStatistic,
  Entity,
} from '../../types';
import {
  KubernetesMigrationDismissForm,
  KubernetesMigrationDismissFormData,
} from '../forms';
import { Lifecycle } from '@backstage/core-components';

export interface KubernetesMigrationData {
  startDate: string;
  endDate: string;
  change: ChangeStatistic;
  services: Array<Entity>;
}

export interface KubernetesMigrationApi extends Alert {
  api: CostInsightsApi;
  data: KubernetesMigrationData;
}

/**
 * This is an example of an Alert implementation using optional event hooks.
 *
 * Event hooks can be used to enable users to dismiss, snooze, or accept an action item
 * - or any combination thereof. Defining a hook will generate default UI - button, dialog and
 * form. Cost Insights does not preserve client side alert state - each hook is expected to return a new set of alerts.
 *
 * Snoozed, accepted, etc. alerts should define a corresponding status property. Alerts will be aggregated
 * by status in a collapsed view below Alert Insights section and a badge will appear in Action Items
 * showing the total alerts of that status.
 *
 * Customizing Alerts
 * Default forms can be overridden in two ways - by setting a form property to null or defining a custom component.
 *
 * If a form property is set to null, the Dialog will not render a form. This can be useful in scenarios
 * where data isn't needed from the user such as when a user accepts an action item's recommendation.
 *
 * If a form property is set to a React component, the Dialog will render the form component in place of the default form.
 * Form components must return valid form elements, and accept a ref and onSubmit event handler.
 * Custom forms must implement the corresponding event hook. See /forms for example implementations.
 */

export class KubernetesMigrationAlert implements KubernetesMigrationApi {
  api: CostInsightsApi;
  data: KubernetesMigrationData;

  subtitle =
    'Services running on Kubernetes are estimated to save 50% or more compared to Compute Engine.';

  // Dialog will not render a form if form property set to null.
  AcceptForm = null;
  // Overrides default Dismiss form with a custom form component.
  DismissForm: AlertForm<
    KubernetesMigrationAlert,
    KubernetesMigrationDismissFormData
  > = KubernetesMigrationDismissForm;

  constructor(api: CostInsightsApi, data: KubernetesMigrationData) {
    this.api = api;
    this.data = data;
  }

  get title() {
    return (
      <span>
        Consider migrating{' '}
        {pluralize('service', this.data.services.length, true)} to Kubernetes{' '}
        <Lifecycle shorthand />
      </span>
    );
  }

  get element() {
    const subheader = `${pluralize(
      'Service',
      this.data.services.length,
      true,
    )}, sorted by cost`;
    return (
      <KubernetesMigrationAlertCard
        data={this.data}
        title="Migrate to Kubernetes"
        subheader={subheader}
        currentProduct="Compute Engine"
        comparedProduct="Kubernetes"
      />
    );
  }

  /* Fires when the onSubmit event is raised on a Dismiss form. Displays custom dismiss form. */
  async onDismissed(
    options: AlertOptions<KubernetesMigrationDismissFormData>,
  ): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.filter(a => a.title !== this.title),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Dismissed,
        },
      ]),
    );
  }

  /* Fires when the onSubmit event is raised on a Snooze form. Displays default snooze form. */
  async onSnoozed(
    options: AlertOptions<AlertSnoozeFormData>,
  ): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.filter(a => a.title !== this.title),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Snoozed,
        },
      ]),
    );
  }

  /* Fires when the Accept button is clicked. Dialog does not render a form. See KubernetesMigrationAlert.AcceptForm */
  async onAccepted(options: AlertOptions<null>): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.filter(a => a.title !== this.title),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Accepted,
        },
      ]),
    );
  }
}
