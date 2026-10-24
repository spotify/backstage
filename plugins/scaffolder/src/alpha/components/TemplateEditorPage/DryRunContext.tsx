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

import yaml from 'yaml';
import { useApi } from '@backstage/core-plugin-api';
import { JsonObject, JsonValue } from '@backstage/types';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  scaffolderApiRef,
  ScaffolderDryRunResponse,
  useTemplateSecrets,
} from '@backstage/plugin-scaffolder-react';
import { useFormDecorators } from '../../hooks/useFormDecorators';

const MAX_CONTENT_SIZE = 64 * 1024;
const CHUNK_SIZE = 32 * 1024;

interface DryRunOptions {
  templateContent: string;
  values: JsonObject;
  files: Array<{ path: string; content: string }>;
}

export interface DryRunResult extends ScaffolderDryRunResponse {
  id: number;
}

interface DryRun {
  results: DryRunResult[];
  selectedResult: DryRunResult | undefined;

  selectResult(id: number): void;
  deleteResult(id: number): void;
  execute(options: DryRunOptions): Promise<void>;
}

const DryRunContext = createContext<DryRun | undefined>(undefined);

interface DryRunProviderProps {
  children: ReactNode;
}

export function base64EncodeContent(content: string): string {
  if (content.length > MAX_CONTENT_SIZE) {
    return window.btoa('<file too large>');
  }

  // Always encode as UTF-8. btoa on its own succeeds for characters in
  // U+0080-U+00FF and emits them as single Latin-1 bytes, which are not valid
  // UTF-8 once the result is decoded again.
  const buffer = new TextEncoder().encode(content);

  const chunks = new Array<string>();
  for (let offset = 0; offset < buffer.length; offset += CHUNK_SIZE) {
    chunks.push(
      String.fromCharCode(...buffer.slice(offset, offset + CHUNK_SIZE)),
    );
  }
  return window.btoa(chunks.join(''));
}

export function DryRunProvider(props: DryRunProviderProps) {
  const decorators = useFormDecorators();
  const scaffolderApi = useApi(scaffolderApiRef);
  const { secrets: contextSecrets } = useTemplateSecrets();
  const [state, setState] = useState<
    Pick<DryRun, 'results' | 'selectedResult'>
  >({
    results: [],
    selectedResult: undefined,
  });
  const idRef = useRef(1);

  const selectResult = useCallback((id: number) => {
    setState(prevState => {
      const result = prevState.results.find(r => r.id === id);
      if (result === prevState.selectedResult) {
        return prevState;
      }
      return {
        results: prevState.results,
        selectedResult: result,
      };
    });
  }, []);

  const deleteResult = useCallback((id: number) => {
    setState(prevState => {
      const index = prevState.results.findIndex(r => r.id === id);
      if (index === -1) {
        return prevState;
      }
      const newResults = prevState.results.slice();
      const [deleted] = newResults.splice(index, 1);
      return {
        results: newResults,
        selectedResult:
          prevState.selectedResult?.id === deleted.id
            ? newResults[0]
            : prevState.selectedResult,
      };
    });
  }, []);

  const execute = useCallback(
    async (options: DryRunOptions) => {
      if (!scaffolderApi.dryRun) {
        throw new Error('Scaffolder API does not support dry-run');
      }

      const parsed = yaml.parse(options.templateContent);

      const { formState: values, secrets } = await decorators.run({
        formState: options.values as Record<string, JsonValue>,
        secrets: contextSecrets,
        manifest: parsed?.spec,
      });

      const response = await scaffolderApi.dryRun({
        template: parsed,
        values,
        secrets,
        directoryContents: options.files.map(file => ({
          path: file.path,
          base64Content: base64EncodeContent(file.content),
        })),
      });

      const result = {
        ...response,
        id: idRef.current++,
      };

      setState(prevState => ({
        results: [...prevState.results, result],
        selectedResult: prevState.selectedResult ?? result,
      }));
    },
    [scaffolderApi, decorators, contextSecrets],
  );

  const dryRun = useMemo(
    () => ({
      ...state,
      selectResult,
      deleteResult,
      execute,
    }),
    [state, selectResult, deleteResult, execute],
  );

  return (
    <DryRunContext.Provider value={dryRun}>
      {props.children}
    </DryRunContext.Provider>
  );
}

export function useDryRun(): DryRun {
  const value = useContext(DryRunContext);
  if (!value) {
    throw new Error('must be used within a DryRunProvider');
  }
  return value;
}
