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

import { DatabaseManager } from './DatabaseManager';

/**
 * Implements a Database Manager which will automatically create new databases
 * for plugins when requested. All requested databases are created with the
 * credentials provided; if the database already exists no attempt to create
 * the database will be made.
 *
 * @deprecated Use `DatabaseManager` from `@backend-common` instead.
 */
export const SingleConnectionDatabaseManager = DatabaseManager;
