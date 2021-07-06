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

import Docker from 'dockerode';
import fs from 'fs-extra';
import { PassThrough } from 'stream';
import { ContainerRunner, RunContainerOptions } from './ContainerRunner';

export type UserOptions = {
  User?: string;
};

export class DockerContainerRunner implements ContainerRunner {
  private readonly dockerClient: Docker;

  constructor({ dockerClient }: { dockerClient: Docker }) {
    this.dockerClient = dockerClient;
  }

  async runContainer({
    imageName,
    command,
    args,
    logStream = new PassThrough(),
    mountDirs = {},
    workingDir,
    envVars = {},
  }: RunContainerOptions) {
    // Show a better error message when Docker is unavailable.
    try {
      await this.dockerClient.ping();
    } catch (e) {
      throw new Error(
        `This operation requires Docker. Docker does not appear to be available. Docker.ping() failed with: ${e.message}`,
      );
    }

    await new Promise<void>((resolve, reject) => {
      this.dockerClient.pull(imageName, {}, (err, stream) => {
        if (err) return reject(err);
        stream.pipe(logStream, { end: false });
        stream.on('end', () => resolve());
        stream.on('error', (error: Error) => reject(error));
        return undefined;
      });
    });

    const userOptions: UserOptions = {};
    if (process.getuid && process.getgid) {
      // Files that are created inside the Docker container will be owned by
      // root on the host system on non Mac systems, because of reasons. Mainly the fact that
      // volume sharing is done using NFS on Mac and actual mounts in Linux world.
      // So we set the user in the container as the same user and group id as the host.
      // On Windows we don't have process.getuid nor process.getgid
      userOptions.User = `${process.getuid()}:${process.getgid()}`;
    }

    // Initialize volumes to mount based on mountDirs map
    const Volumes: { [T: string]: object } = {};
    for (const containerDir of Object.values(mountDirs)) {
      Volumes[containerDir] = {};
    }

    // Create bind volumes
    const Binds: string[] = [];
    for (const [hostDir, containerDir] of Object.entries(mountDirs)) {
      // Need to use realpath here as Docker mounting does not like
      // symlinks for binding volumes
      const realHostDir = await fs.realpath(hostDir);
      Binds.push(`${realHostDir}:${containerDir}`);
    }

    // Create docker environment variables array
    const Env = [];
    for (const [key, value] of Object.entries(envVars)) {
      Env.push(`${key}=${value}`);
    }

    const [
      { Error: error, StatusCode: statusCode },
    ] = await this.dockerClient.run(imageName, args, logStream, {
      Volumes,
      HostConfig: {
        Binds,
      },
      ...(workingDir ? { WorkingDir: workingDir } : {}),
      Entrypoint: command,
      Env,
      ...userOptions,
    } as Docker.ContainerCreateOptions);

    if (error) {
      throw new Error(
        `Docker failed to run with the following error message: ${error}`,
      );
    }

    if (statusCode !== 0) {
      throw new Error(
        `Docker container returned a non-zero exit code (${statusCode})`,
      );
    }
  }
}
