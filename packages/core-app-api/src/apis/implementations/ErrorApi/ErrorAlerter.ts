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
import { ErrorApi, ErrorContext, AlertApi } from '@backstage/core-plugin-api';

/**
 * Decorates an ErrorApi by also forwarding error messages
 * to the alertApi with an 'error' severity.
 */
export class ErrorAlerter implements ErrorApi {
  constructor(
    private readonly alertApi: AlertApi,
    private readonly errorApi: ErrorApi,
  ) {}

  post(error: Error, context?: ErrorContext) {
    if (!context?.hidden) {
      this.alertApi.post({ message: error.message, severity: 'error' });
    }

    return this.errorApi.post(error, context);
  }

  error$() {
    return this.errorApi.error$();
  }
}
