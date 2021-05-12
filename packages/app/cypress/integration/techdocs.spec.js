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

describe('TechDocs', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('Navigating to TechDocs', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/catalog/entities**', {
        fixture: 'entities.json',
      });

      cy.intercept('GET', '**/guest', {
        fixture: 'guest.json',
      });

      cy.mockTechDocs();
    });

    it('should navigate to the TechDocs page via the primary navigation bar', () => {
      cy.visit('/');
      cy.get('[data-testid="sidebar-root"]')
        .get('div')
        .get('a[href="/docs"]')
        .click();

      cy.contains('Documentation');
    });

    it('should navigate to the TechDocs home page from a URL', () => {
      cy.visit('/docs');

      cy.contains('Documentation');
    });

    it('should navigate to a specific TechDocs component page from a URL', () => {
      cy.visit('/docs/default/Component/backstage');

      cy.contains('Backstage');
      cy.contains(
        'Main documentation for Backstage features and platform APIs',
      );
      cy.get('[data-testid="techdocs-content-shadowroot"]')
        .shadow()
        .contains('The Backstage documentation is available at');
    });

    it('should navigate to a specific TechDocs fragment from a URL', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');

      cy.get('[data-testid="techdocs-content-shadowroot"]')
        .shadow()
        .within(() => {
          cy.contains('Phases');
          cy.contains('Detailed roadmap');
        });
    });

    it('should navigate to a specific TechDocs hash from a URL', () => {
      cy.visit(
        '/docs/default/Component/backstage/overview/roadmap/#future-work',
      );

      cy.get('[data-testid="techdocs-content-shadowroot"]')
        .shadow()
        .within(() => {
          // eslint-disable-next-line jest/valid-expect
          cy.get('#future-work').should($element =>
            expect($element[0].offsetTop).to.be.closeTo(1040, 200),
          );
          cy.contains('Future work');
        });
    });
  });

  describe('Navigating within TechDocs', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/catalog/entities**', {
        fixture: 'entities.json',
      });

      cy.intercept('GET', '**/guest', {
        fixture: 'guest.json',
      });

      cy.mockTechDocs();
    });
    it('should navigate to the TechDocs page via the table of contents', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');

      cy.get('[data-testid="techdocs-content-shadowroot"]')
        .shadow()
        .within(() => {
          cy.get(
            'body > div.md-container > main > div > div.md-sidebar.md-sidebar--primary > div > div > nav > ul > li:nth-child(1)',
          ).click();
          cy.get(
            'body > div.md-container > main > div > div.md-sidebar.md-sidebar--primary > div > div > nav > ul > li:nth-child(1) > nav > ul > li:nth-child(3)',
          ).click();

          cy.contains('Phases');
          cy.contains('Detailed roadmap');
        });
    });
  });
});
