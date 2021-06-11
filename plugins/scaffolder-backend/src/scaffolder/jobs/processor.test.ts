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
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';
import mockFs from 'mock-fs';
import os from 'os';
import { RequiredTemplateValues } from '../stages/templater';
import { makeLogStream } from './logger';
import { JobProcessor } from './processor';
import { StageInput } from './types';

describe('JobProcessor', () => {
  const mockEntity: TemplateEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location':
          'github:https://github.com/benjdlambert/backstage-graphql-template/blob/master/template.yaml',
      },
      name: 'graphql-starter',
      title: 'GraphQL Service',
      description:
        'A GraphQL starter template for backstage to get you up and running\nthe best practices with GraphQL\n',
      uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
      etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',

      generation: 1,
    },
    spec: {
      type: 'website',
      templater: 'cookiecutter',
      path: './template',
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        required: ['storePath', 'owner'],
        properties: {
          owner: {
            type: 'string',
            title: 'Owner',
            description: 'Who is going to own this component',
          },
          storePath: {
            type: 'string',
            title: 'Store path',
            description: 'GitHub store path in org/repo format',
          },
        },
      },
      owner: 'example@email.com',
    },
  };

  const mockValues: RequiredTemplateValues = {
    owner: 'blobby',
    storePath: 'https://github.com/backstage/mock-repo',
    destination: {
      git: parseGitUrl('https://github.com/backstage/mock-repo'),
    },
  };

  const workingDirectory = os.platform() === 'win32' ? 'C:\\tmp' : '/tmp';

  // NOTE(freben): Without this line, mock-fs makes winston/logform break.
  // There are a number of reported issues with logform and its use of dynamic
  // strings for imports. It confuses webpack. The basic fix is to trigger
  // those imports before mock-fs runs. I wanted to add a mock dir
  // 'node_modules': mockFs.passthrough(), but that doesn't seem to be a thing
  // in mock-fs 4.
  // Probable REAL fix: https://github.com/winstonjs/logform/pull/117
  makeLogStream({});

  beforeEach(() => {
    mockFs({
      [workingDirectory]: mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('create', () => {
    it('creates should create a new job with a unique id', async () => {
      const processor = new JobProcessor(workingDirectory);

      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages: [],
      });

      expect(job.id).toMatch(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      );
    });

    it('should setup the correct context for the job', async () => {
      const processor = new JobProcessor(workingDirectory);

      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages: [],
      });

      expect(job.context.entity).toBe(mockEntity);
      expect(job.context.values).toBe(mockValues);
    });

    it('should set the status as pending', async () => {
      const processor = new JobProcessor(workingDirectory);

      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages: [],
      });

      expect(job.status).toBe('PENDING');
    });

    it('should create the correct stages', async () => {
      const stages: StageInput[] = [
        {
          name: 'Do something cool step 1',
          handler: jest.fn(),
        },
        {
          name: 'Do something cool step 2',
          handler: jest.fn(),
        },
      ];

      const processor = new JobProcessor(workingDirectory);

      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages,
      });

      expect(job.stages).toHaveLength(stages.length);

      for (let i = 0; i < job.stages.length; i++) {
        expect(job.stages[i].name).toBe(stages[i].name);
        expect(job.stages[i].status).toBe('PENDING');
      }
    });
  });

  describe('get', () => {
    it('return undefined for when the job does not exist', () => {
      const processor = new JobProcessor(workingDirectory);
      expect(processor.get('123')).not.toBeDefined();
    });

    it('should return the exact same instance of the job when one is created', async () => {
      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages: [],
      });

      expect(processor.get(job.id)).toBe(job);
    });
  });

  describe('process', () => {
    it('throws an error when the status of the job is not in pending state', async () => {
      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages: [],
      });

      job.status = 'STARTED';

      await expect(processor.run(job)).rejects.toThrow(
        /Job is not in a 'PENDING' state/,
      );
    });

    it('will call each of the handlers in the stages', async () => {
      const stages: StageInput[] = [
        {
          name: 'c/o',
          handler: jest.fn(),
        },
        {
          name: 'g/p',
          handler: jest.fn(),
        },
      ];

      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages,
      });

      await processor.run(job);

      for (const stage of stages) {
        expect(stage.handler).toHaveBeenCalled();
      }
    });

    it('should set all stages to complete and the job to complete when finishes without errors', async () => {
      const stages: StageInput[] = [
        {
          name: 'c/o',
          handler: jest.fn(),
        },
        {
          name: 'g/p',
          handler: jest.fn(),
        },
      ];

      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages,
      });

      await processor.run(job);

      for (const stage of job.stages) {
        expect(stage.status).toBe('COMPLETED');
      }

      expect(job.status).toBe('COMPLETED');
    });

    it('should merge the return value from previous steps into the context of the next step', async () => {
      const stages: StageInput[] = [
        {
          name: 'c/o',
          handler: jest
            .fn()
            .mockResolvedValue({ first: 'ben', second: 'lambert' }),
        },
        {
          name: 'g/p',
          handler: jest
            .fn()
            .mockResolvedValue({ second: 'linus', third: 'lambert' }),
        },
        {
          name: 'go',
          handler: jest.fn(),
        },
      ];

      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages,
      });

      await processor.run(job);

      expect(stages[1].handler).toHaveBeenCalledWith(
        expect.objectContaining({ first: 'ben', second: 'lambert' }),
      );

      expect(stages[2].handler).toHaveBeenCalledWith(
        expect.objectContaining({
          first: 'ben',
          second: 'linus',
          third: 'lambert',
        }),
      );
    });

    it('should fail the job and the step if one of them fails', async () => {
      const fail = new Error('something went wrong here');
      const stages: StageInput[] = [
        {
          name: 'c/o',
          handler: jest.fn(),
        },
        {
          name: 'g/p',
          handler: jest.fn().mockRejectedValue(fail),
        },
        {
          name: 'go',
          handler: jest.fn(),
        },
      ];

      const processor = new JobProcessor(workingDirectory);
      const job = processor.create({
        entity: mockEntity,
        values: mockValues,
        stages,
      });

      await processor.run(job);

      expect(job.status).toBe('FAILED');
      expect(job.stages[0].status).toBe('COMPLETED');
      expect(job.stages[1].status).toBe('FAILED');
      expect(job.stages[2].status).toBe('PENDING');
      expect(job.error?.message).toBe('something went wrong here');
      expect(job.stages[1].log.join()).toContain('something went wrong here');
    });
  });
});
