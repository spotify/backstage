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

const API_ENDPOINT = 'http://localhost:7000/api/search/query';

describe('SearchPage', () => {
  describe('Given a search context with a term, results, and filter values', () => {
    it('The results are rendered as expected', () => {
      const results = [
        {
          type: 'software-catalog',
          document: {
            title: 'backstage',
            text: 'Backstage system documentation',
            location: '/result/location/path',
          },
        },
      ];

      cy.enterAsGuest();
      cy.visit('/search-next', {
        onBeforeLoad(win) {
          cy.stub(win, 'fetch')
            .withArgs(`${API_ENDPOINT}?term=&pageCursor=`)
            .resolves({
              ok: true,
              json: () => ({ results }),
            });
        },
      });
      cy.contains('Search');

      cy.contains(results[0].document.title);
      cy.contains(results[0].document.text);
      cy.get(`a[href="${results[0].document.location}"]`).should('be.visible');
    });

    it('The filters are rendered as expected', () => {
      cy.enterAsGuest();
      cy.visit(
        '/search-next?filters%5Bkind%5D=Component&filters%5Blifecycle%5D%5B%5D=experimental',
        {
          onBeforeLoad(win) {
            cy.stub(win, 'fetch')
              .withArgs(
                `${API_ENDPOINT}?term=&filters%5Bkind%5D=Component&filters%5Blifecycle%5D%5B0%5D=experimental&pageCursor=`,
              )
              .resolves({
                ok: true,
                json: () => ({ results: [] }),
              });
          },
        },
      );
      cy.contains('Search');

      // lifecycle
      cy.contains('lifecycle');

      cy.contains('experimental');
      cy.get(
        '[data-testid="search-checkboxfilter-next"] input[value="experimental"]',
      ).should('have.attr', 'checked');

      cy.contains('production');
      cy.get(
        '[data-testid="search-checkboxfilter-next"] input[value="production"]',
      ).should('not.have.attr', 'checked');

      // kind
      cy.contains('kind');
      cy.get(
        '[data-testid="search-selectfilter-next"] [role="button"][aria-haspopup="listbox"]',
      ).click();

      cy.contains('All');
      cy.contains('Template');
      cy.contains('Component');

      cy.get('[role="option"][data-value="Component"]').should(
        'have.attr',
        'aria-selected',
        'true',
      );
    });

    it('The search bar is rendered as expected', () => {
      cy.enterAsGuest();
      cy.visit('/search-next?query=backstage', {
        onBeforeLoad(win) {
          cy.stub(win, 'fetch')
            .withArgs(`${API_ENDPOINT}?term=backstage&pageCursor=`)
            .resolves({
              ok: true,
              json: () => ({ results: [] }),
            });
        },
      });
      cy.contains('Search');

      cy.get('[data-testid="search-bar-next"] input').should(
        'have.attr',
        'value',
        'backstage',
      );
    });
  });
});
