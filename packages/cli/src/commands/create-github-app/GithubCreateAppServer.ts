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

import crypto from 'crypto';
import openBrowser from 'react-dev-utils/openBrowser';
import { request } from '@octokit/request';
import express, { Express, Request, Response } from 'express';

const MANIFEST_DATA = {
  default_events: ['create', 'delete', 'push', 'repository'],
  default_permissions: {
    contents: 'read',
    metadata: 'read',
  },
  name: 'Backstage-<changeme>',
  url: 'https://backstage.io',
  description: 'GitHub App for Backstage',
  public: false,
};

const FORM_PAGE = `
<html>
  <body>
    <form id="form" action="ACTION_URL" method="post">
      <input type="hidden" name="manifest" value="MANIFEST_JSON">
      <input type="submit" value="Continue">
    </form>
    <script>
      document.getElementById("form").submit()
    </script>
  </body>
</html>
`;

type GithubAppConfig = {
  appId: number;
  slug?: string;
  name?: string;
  webhookUrl?: string;
  clientId: string;
  clientSecret: string;
  webhookSecret: string;
  privateKey: string;
};

export class GithubCreateAppServer {
  private baseUrl?: string;
  private webhookUrl?: string;

  static async run({ org }: { org: string }): Promise<GithubAppConfig> {
    const encodedOrg = encodeURIComponent(org);
    const actionUrl = `https://github.com/organizations/${encodedOrg}/settings/apps/new`;
    const server = new GithubCreateAppServer(actionUrl);
    return server.start();
  }

  constructor(private readonly actionUrl: string) {
    const webhookId = crypto
      .randomBytes(15)
      .toString('base64')
      .replace(/[\+\/]/g, '');

    this.webhookUrl = `https://smee.io/${webhookId}`;
  }

  private async start(): Promise<GithubAppConfig> {
    const app = express();

    app.get('/', this.formHandler);

    const callPromise = new Promise<GithubAppConfig>((resolve, reject) => {
      app.get('/callback', (req, res) => {
        request(
          `POST /app-manifests/${encodeURIComponent(
            req.query.code as string,
          )}/conversions`,
        ).then(({ data }) => {
          resolve({
            name: data.name,
            slug: data.slug,
            appId: data.id,
            webhookUrl: this.webhookUrl,
            clientId: data.client_id,
            clientSecret: data.client_secret,
            webhookSecret: data.webhook_secret,
            privateKey: data.pem,
          });
          res.redirect(302, `${data.html_url}/installations/new`);
        }, reject);
      });
    });

    this.baseUrl = await this.listen(app);

    openBrowser(this.baseUrl);

    return callPromise;
  }

  private formHandler = (_req: Request, res: Response) => {
    const baseUrl = this.baseUrl;
    if (!baseUrl) {
      throw new Error('baseUrl is not set');
    }
    const manifest = {
      ...MANIFEST_DATA,
      redirect_url: `${baseUrl}/callback`,
      hook_attributes: {
        url: this.webhookUrl,
        active: false,
      },
    };
    const manifestJson = JSON.stringify(manifest).replace(/\"/g, '&quot;');

    let body = FORM_PAGE;
    body = body.replace('MANIFEST_JSON', manifestJson);
    body = body.replace('ACTION_URL', this.actionUrl);

    res.setHeader('content-type', 'text/html');
    res.send(body);
  };

  private async listen(app: Express) {
    return new Promise<string>((resolve, reject) => {
      const listener = app.listen(0, () => {
        const info = listener.address();
        if (typeof info !== 'object' || info === null) {
          reject(new Error(`Unexpected listener info '${info}'`));
          return;
        }
        const { port } = info;
        resolve(`http://localhost:${port}`);
      });
    });
  }
}
