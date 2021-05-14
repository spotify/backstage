/*
 * Copyright 2021 The Backstage Authors
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
/// <reference types="cypress" />
import 'os';
import { API_BASE_URL } from '../settings';

describe('Integrations', () => {
  describe('ReadTree', () => {
    it('should work for github', () => {
      cy.loginAsGuest();

      cy.request('POST', `${API_BASE_URL}/api/catalog/locations`, {
        target:
          'https://github.com/backstage-verification/test-repo/blob/main/**/*',
        type: 'url',
      });

      cy.wait(5000);

      cy.visit('/catalog');
      cy.get('[data-testid="user-picker-all"]').click();
      cy.get('table').should('contain', 'github-repo');
      cy.get('table').should('contain', 'github-repo-nested');
    });

    // it('should work for azure', () => {
    //   cy.loginAsGuest();

    //   cy.request('POST', '/api/catalog/locations', {
    //     target:
    //       'https://dev.azure.com/backstage-verification/_git/test-repo?path=*',
    //     type: 'url',
    //   });
    // });

    it('should work for gitlab', () => {
      cy.loginAsGuest();

      cy.request('POST', `${API_BASE_URL}/api/catalog/locations`, {
        target:
          'https://gitlab.com/backstage-verification/test-repo/-/tree/master/**/*',
        type: 'url',
      });

      cy.wait(5000);

      cy.visit('/catalog');
      cy.get('[data-testid="user-picker-all"]').click();
      cy.get('table').should('contain', 'gitlab-repo');
      cy.get('table').should('contain', 'gitlab-repo-nested');
    });

    it('should work for bitbucket', () => {
      cy.loginAsGuest();

      cy.request('POST', `${API_BASE_URL}/api/catalog/locations`, {
        target:
          'https://bitbucket.org/backstage-verification/test-repo/src/master/**/*',
        type: 'url',
      });

      cy.wait(5000);

      cy.visit('/catalog');
      cy.get('[data-testid="user-picker-all"]').click();
      cy.get('table').should('contain', 'bitbucket-repo');
      cy.get('table').should('contain', 'bitbucket-repo-nested');
    });
  });
});
