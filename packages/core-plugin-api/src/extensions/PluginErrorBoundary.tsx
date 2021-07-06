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

import React from 'react';
import { AppContext } from '../app/types';
import { BackstagePlugin } from '../plugin';

type Props = {
  app: AppContext;
  plugin: BackstagePlugin;
};

type State = { error: Error | undefined };

export class PluginErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state: State = { error: undefined };

  handleErrorReset = () => {
    this.setState({ error: undefined });
  };

  render() {
    const { error } = this.state;
    const { app, plugin } = this.props;
    const { ErrorBoundaryFallback } = app.getComponents();

    if (error) {
      return (
        <ErrorBoundaryFallback
          error={error}
          resetError={this.handleErrorReset}
          plugin={plugin}
        />
      );
    }

    return this.props.children;
  }
}
