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

const runCommand = jest.fn();
const commandExists = jest.fn();

jest.mock('./helpers', () => ({ runCommand }));
jest.mock('command-exists-promise', () => commandExists);
jest.mock('fs-extra');

import { ContainerRunner } from '@backstage/backend-common';
import fs from 'fs-extra';
import parseGitUrl from 'git-url-parse';
import path from 'path';
import { PassThrough } from 'stream';
import { CookieCutter } from './cookiecutter';

describe('CookieCutter Templater', () => {
  const containerRunner: jest.Mocked<ContainerRunner> = {
    runContainer: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write a cookiecutter.json file with the values from the entity', async () => {
    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      description: 'description',
      component_id: 'newthing',
      destination: {
        git: parseGitUrl('https://github.com/org/repo'),
      },
    };

    jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

    const templater = new CookieCutter({ containerRunner });
    await templater.run({
      workspacePath: 'tempdir',
      values,
    });

    expect(fs.ensureDir).toBeCalledWith(path.join('tempdir', 'intermediate'));
    expect(fs.writeJson).toBeCalledWith(
      path.join('tempdir', 'template', 'cookiecutter.json'),
      expect.objectContaining(values),
    );
  });

  it('should merge any value that is in the cookiecutter.json path already', async () => {
    const existingJson = {
      _copy_without_render: ['./github/workflows/*'],
    };

    jest
      .spyOn(fs, 'readJSON')
      .mockImplementationOnce(() => Promise.resolve(existingJson));
    jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      component_id: 'something',
      destination: {
        git: parseGitUrl('https://github.com/org/repo'),
      },
    };

    const templater = new CookieCutter({ containerRunner });
    await templater.run({
      workspacePath: 'tempdir',
      values,
    });

    expect(fs.writeJSON).toBeCalledWith(
      path.join('tempdir', 'template', 'cookiecutter.json'),
      {
        ...existingJson,
        ...values,
        destination: {
          git: expect.objectContaining({ organization: 'org', name: 'repo' }),
        },
      },
    );
  });

  it('should throw an error if the cookiecutter json is malformed and not missing', async () => {
    jest.spyOn(fs, 'readJSON').mockImplementationOnce(() => {
      throw new Error('BAM');
    });

    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      destination: {
        git: parseGitUrl('https://github.com/org/repo'),
      },
    };

    const templater = new CookieCutter({ containerRunner });
    await expect(
      templater.run({
        workspacePath: 'tempdir',
        values,
      }),
    ).rejects.toThrow('BAM');
  });

  it('should run the correct docker container with the correct bindings for the volumes', async () => {
    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      component_id: 'newthing',
      destination: {
        git: parseGitUrl('https://github.com/org/repo'),
      },
    };

    jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
    jest
      .spyOn(fs, 'realpath')
      .mockImplementation(x => Promise.resolve(x.toString()));

    const templater = new CookieCutter({ containerRunner });
    await templater.run({
      workspacePath: 'tempdir',
      values,
    });

    expect(containerRunner.runContainer).toHaveBeenCalledWith({
      imageName: 'spotify/backstage-cookiecutter',
      command: 'cookiecutter',
      args: ['--no-input', '-o', '/output', '/input', '--verbose'],
      envVars: { HOME: '/tmp' },
      mountDirs: {
        [path.join('tempdir', 'template')]: '/input',
        [path.join('tempdir', 'intermediate')]: '/output',
      },
      workingDir: '/input',
      logStream: undefined,
    });
  });

  it('should run the docker container mentioned in configs, overriding the default', async () => {
    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      imageName: 'foo/cookiecutter-image-with-extensions',
    };

    jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

    const templater = new CookieCutter({ containerRunner });
    await templater.run({
      workspacePath: 'tempdir',
      values,
    });

    expect(containerRunner.runContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        imageName: 'foo/cookiecutter-image-with-extensions',
      }),
    );
  });

  it('should pass through the streamer to the run docker helper', async () => {
    const stream = new PassThrough();

    const values = {
      owner: 'blobby',
      storePath: 'https://github.com/org/repo',
      component_id: 'newthing',
      destination: {
        git: parseGitUrl('https://github.com/org/repo'),
      },
    };

    jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);

    const templater = new CookieCutter({ containerRunner });
    await templater.run({
      workspacePath: 'tempdir',
      values,
      logStream: stream,
    });

    expect(containerRunner.runContainer).toHaveBeenCalledWith({
      imageName: 'spotify/backstage-cookiecutter',
      command: 'cookiecutter',
      args: ['--no-input', '-o', '/output', '/input', '--verbose'],
      envVars: { HOME: '/tmp' },
      mountDirs: {
        [path.join('tempdir', 'template')]: '/input',
        [path.join('tempdir', 'intermediate')]: '/output',
      },
      workingDir: '/input',
      logStream: stream,
    });
  });

  describe('when cookiecutter is available', () => {
    it('use the binary', async () => {
      const stream = new PassThrough();

      const values = {
        owner: 'blobby',
        storePath: 'https://github.com/org/repo',
        component_id: 'newthing',
        destination: {
          git: parseGitUrl('https://github.com/org/repo'),
        },
      };

      jest.spyOn(fs, 'readdir').mockResolvedValueOnce(['newthing'] as any);
      commandExists.mockImplementationOnce(() => () => true);

      const templater = new CookieCutter({ containerRunner });
      await templater.run({
        workspacePath: 'tempdir',
        values,
        logStream: stream,
      });

      expect(runCommand).toHaveBeenCalledWith({
        command: 'cookiecutter',
        args: expect.arrayContaining([
          '--no-input',
          '-o',
          path.join('tempdir', 'intermediate'),
          path.join('tempdir', 'template'),
          '--verbose',
        ]),
        logStream: stream,
      });
    });
  });

  describe('when nothing was generated', () => {
    it('throws an error', async () => {
      const stream = new PassThrough();

      jest
        .spyOn(fs, 'readdir')
        .mockImplementationOnce(() => Promise.resolve([]));

      const templater = new CookieCutter({ containerRunner });
      await expect(
        templater.run({
          workspacePath: 'tempdir',
          values: {
            owner: 'blobby',
            storePath: 'https://github.com/org/repo',
            destination: {
              git: parseGitUrl('https://github.com/org/repo'),
            },
          },
          logStream: stream,
        }),
      ).rejects.toThrow(/No data generated by cookiecutter/);
    });
  });
});
