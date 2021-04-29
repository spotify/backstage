/*
 * Copyright 2020 Spotify AB
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
  Content,
  errorApiRef,
  Header,
  InfoCard,
  Lifecycle,
  Page,
  useApi,
  useRouteRef,
} from '@backstage/core';
import { LinearProgress } from '@material-ui/core';
import { FormValidation, IChangeEvent } from '@rjsf/core';
import parseGitUrl from 'git-url-parse';
import React, { useCallback, useState } from 'react';
import { generatePath, useNavigate, Navigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { scaffolderApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { MultistepJsonForm } from '../MultistepJsonForm';
import { RepoUrlPicker, OwnerPicker } from '../fields';
import { JsonObject } from '@backstage/config';

const useTemplateParameterSchema = (templateName: string) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () =>
      scaffolderApi.getTemplateParameterSchema({
        name: templateName,
        kind: 'template',
        namespace: 'default',
      }),
    [scaffolderApi, templateName],
  );
  return { schema: value, loading, error };
};

function isObject(obj: unknown): obj is JsonObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export const createValidator = (rootSchema: JsonObject) => {
  function validate(
    schema: JsonObject,
    formData: JsonObject,
    errors: FormValidation,
  ) {
    const schemaProps = schema.properties;
    if (!isObject(schemaProps)) {
      return;
    }

    for (const [key, propData] of Object.entries(formData)) {
      const propErrors = errors[key];

      if (isObject(propData)) {
        const propSchemaProps = schemaProps[key];
        if (isObject(propSchemaProps)) {
          validate(
            propSchemaProps,
            propData as JsonObject,
            propErrors as FormValidation,
          );
        }
      } else {
        const propSchema = schemaProps[key];
        if (
          isObject(propSchema) &&
          propSchema['ui:field'] === 'RepoUrlPicker'
        ) {
          try {
            const { host, searchParams } = new URL(`https://${propData}`);
            const type = searchParams.get('type');
            if (!host || !type) {
              propErrors.addError('Incomplete repository location provided, host required');
            }
            if (type === 'bitbucket') {
              // Bitbucket cloud needs workspace variable
              if (host === 'bitbucket.org') {
                if (
                  !searchParams.get('workspace') ||
                  !searchParams.get('project') ||
                  !searchParams.get('repo')
                ) {
                  propErrors.addError('Incomplete repository location provided, workspace, project and repo required');
                }
              }
              // Bitbucket server does not need workspace variable
              else {
                if (
                  !searchParams.get('project') ||
                  !searchParams.get('repo')
                ) {
                  propErrors.addError('Incomplete repository location provided, project and repo required');
                }
              }
            }
            else {
              if (
                !searchParams.get('owner') ||
                !searchParams.get('repo')
              ) {
                propErrors.addError('Incomplete repository location provided');
              }
            }
          } catch {
            propErrors.addError('Unable to parse the Repository URL');
          }
        }
      }
    }
  }

  return (formData: JsonObject, errors: FormValidation) => {
    validate(rootSchema, formData, errors);
    return errors;
  };
};

const storePathValidator = (
  formData: { storePath?: string },
  errors: FormValidation,
) => {
  const { storePath } = formData;
  if (!storePath) {
    errors.storePath.addError('Store path is required and not present');
    return errors;
  }

  try {
    const parsedUrl = parseGitUrl(storePath);

    if (!parsedUrl.resource || !parsedUrl.owner || !parsedUrl.name) {
      if (parsedUrl.resource === 'dev.azure.com') {
        errors.storePath.addError(
          "The store path should be formatted like https://dev.azure.com/{org}/{project}/_git/{repo} for Azure URL's",
        );
      } else {
        errors.storePath.addError(
          'The store path should be a complete Git URL to the new repository location. For example: https://github.com/{owner}/{repo}',
        );
      }
    }
  } catch (ex) {
    errors.storePath.addError(
      `Failed validation of the store path with message ${ex.message}`,
    );
  }

  return errors;
};

export const TemplatePage = () => {
  const errorApi = useApi(errorApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);
  const { templateName } = useParams();
  const navigate = useNavigate();
  const rootLink = useRouteRef(rootRouteRef);
  const { schema, loading, error } = useTemplateParameterSchema(templateName);
  const [formState, setFormState] = useState({});
  const handleFormReset = () => setFormState({});

  const handleChange = useCallback(
    (e: IChangeEvent) => setFormState({ ...formState, ...e.formData }),
    [setFormState, formState],
  );

  const handleCreate = async () => {
    try {
      const id = await scaffolderApi.scaffold(templateName, formState);

      navigate(generatePath(`${rootLink()}/tasks/:taskId`, { taskId: id }));
    } catch (e) {
      errorApi.post(e);
    }
  };

  if (error) {
    errorApi.post(new Error(`Failed to load template, ${error}`));
    return <Navigate to={rootLink()} />;
  }
  if (!loading && !schema) {
    errorApi.post(new Error('Template was not found.'));
    return <Navigate to={rootLink()} />;
  }

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title={
          <>
            Create a New Component <Lifecycle alpha shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        {loading && <LinearProgress data-testid="loading-progress" />}
        {schema && (
          <InfoCard title={schema.title} noPadding>
            <MultistepJsonForm
              formData={formState}
              fields={{ RepoUrlPicker, OwnerPicker }}
              onChange={handleChange}
              onReset={handleFormReset}
              onFinish={handleCreate}
              steps={schema.steps.map(step => {
                // TODO: Can delete this function when the migration from v1 to v2 beta is completed
                // And just have the default validator for all fields.
                if ((step.schema as any)?.properties?.storePath) {
                  return {
                    ...step,
                    validate: (a, b) => storePathValidator(a, b),
                  };
                }

                return {
                  ...step,
                  validate: createValidator(step.schema),
                };
              })}
            />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
