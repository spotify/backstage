/*
 * Copyright 2021 Spotify AB
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

import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import { Config } from '@backstage/config';
import fetch from 'cross-fetch';

type StackOverflowQuestion = {
  title: string;
  link: string;
  owner: Record<string, string>;
  tags: string[];
  answer_count: number;
};

export interface StackOverflowDocument extends IndexableDocument {
  answers: number;
  tags: string[];
}

export class StackOverflowCollator implements DocumentCollator {
  protected baseUrl: string;
  public readonly type: string = 'stack-overflow';

  constructor({ config }: { config: Config }) {
    this.baseUrl = config.getString(
      'search.integrations.stackoverflow.baseUrl',
    );
  }

  async execute() {
    // TODO(emmaindal): configurable params?
    const res = await fetch(
      `${this.baseUrl}/questions?tagged=backstage&site=stackoverflow`,
    );
    const data = await res.json();
    return data.items.map(
      ({
        title,
        link,
        owner: { display_name },
        tags,
        answer_count,
      }: StackOverflowQuestion): StackOverflowDocument => {
        return {
          title: title,
          location: link,
          text: display_name,
          tags: tags,
          answers: answer_count,
        };
      },
    );
  }
}
