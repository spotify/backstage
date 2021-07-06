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
import { Route, Routes } from 'react-router';
import { RegisterComponentPage } from './RegisterComponentPage';
import { RouteRef } from '@backstage/core-plugin-api';

// As we don't know which path the catalog's router mounted on
// We need to inject this from the app

/**
 * Provides a router for registering a component.
 *
 * @deprecated The router for this component is deprecated and replaced with the `catalog-import` plugin.
 * @see https://github.com/backstage/backstage/tree/master/plugins/catalog-import
 */
export const Router = ({ catalogRouteRef }: { catalogRouteRef: RouteRef }) => (
  <Routes>
    <Route
      element={<RegisterComponentPage catalogRouteRef={catalogRouteRef} />}
    />
  </Routes>
);
