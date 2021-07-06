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
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { cloudbuildApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

export const useWorkflowRunsDetails = (projectId: string) => {
  const api = useApi(cloudbuildApiRef);
  const { id } = useParams();
  const details = useAsync(async () => {
    return projectId
      ? api.getWorkflowRun({
          projectId,
          id: id,
        })
      : Promise.reject('No projectId provided');
  }, [projectId, id]);
  return details;
};
