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

    it('should navigate to the TechDocs home page from the "Overview" tab', () => {
      cy.visit('/docs');
      cy.get('[data-testid="read_docs"]').eq(0).click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/docs/default/Component/backstage');
      });
    });

    it('should navigate to the TechDocs home page from the "Owned documents" tab', () => {
      cy.visit('/docs');
      cy.get('[data-testid="header-tab-1"]').click();
      cy.get('[value="backstage"] > div > a').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/docs/default/Component/backstage');
      });
    });

    it('should navigate to a specific TechDocs project page', () => {
      cy.visit('/docs');
      cy.contains('Documentation');
    });

    it('should navigate to a specific TechDocs component page from a URL', () => {
      cy.visit('/docs/default/Component/backstage');

      cy.contains('Backstage');
      cy.contains(
        'Main documentation for Backstage features and platform APIs',
      );
      cy.getTechDocsShadowRoot().contains(
        'The Backstage documentation is available at',
      );
    });

    it('should navigate to a specific TechDocs fragment from a URL', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');

      cy.getTechDocsShadowRoot().within(() => {
        cy.contains('Phases');
        cy.contains('Detailed roadmap');
      });
    });

    it('should navigate to a specific TechDocs hash from a URL', () => {
      cy.visit(
        '/docs/default/Component/backstage/overview/roadmap/#future-work',
      );

      cy.window().its('scrollY').should('equal', 1422);
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
    it('should navigate to the TechDocs page via the navigation bar', () => {
      cy.visit('/docs/default/Component/backstage');

      cy.getTechDocsShadowRoot().within(() => {
        cy.get('[data-testid="md-nav-overview"]').click();
        cy.get('[data-testid="md-nav-roadmap"]').click();

        cy.contains('Phases');
        cy.contains('Detailed roadmap');
      });
    });

    it('should navigate to the TechDocs page via the table of contents - Level 1', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');

      return cy.window().then($win => {
        cy.getTechDocsShadowRoot().within(() => {
          cy.get('[data-testid="md-nav-phases"]', { timeout: 5000 })
            .click()
            .should(() => {
              expect($win.scrollY).to.be.closeTo(407, 100);
            });
        });
      });
    });

    it('should navigate to the TechDocs page via the table of contents - Level 2', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');

      return cy.window().then($win => {
        cy.getTechDocsShadowRoot().within(() => {
          cy.get('[data-testid="md-nav-future-work"]', { timeout: 5000 })
            .click()
            .should(() => {
              expect($win.scrollY).to.be.closeTo(1422, 200);
            });
        });
      });
    });

    it('should navigate to a specific fragment within a TechDocs page', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');
      cy.scrollTo('bottom');
      cy.getTechDocsShadowRoot().within(() => {
        cy.contains('Link to Phases').click();
        cy.window().its('scrollY').should('equal', 407);
      });
    });

    it('should navigate to the next page within a TechDocs page', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');
      cy.scrollTo('bottom');
      cy.getTechDocsShadowRoot().within(() => {
        cy.get('.md-footer-nav__link.md-footer-nav__link--next').click();

        cy.location().should(loc => {
          expect(loc.pathname).to.eq(
            '/docs/default/Component/backstage/overview/vision/',
          );
        });
      });
    });

    it('should navigate to the previous page within a TechDocs page', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');
      cy.scrollTo('bottom');
      cy.getTechDocsShadowRoot().within(() => {
        cy.get('.md-footer-nav__link.md-footer-nav__link--prev').click();

        cy.location().should(loc => {
          expect(loc.pathname).to.eq(
            '/docs/default/Component/backstage/overview/architecture-overview/',
          );
        });
      });
    });

    it('should navigate to an external site', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');
      cy.scrollTo('bottom');
      cy.getTechDocsShadowRoot().within(() => {
        cy.get('.md-footer-nav__link.md-footer-nav__link--prev').click();

        cy.location().should(loc => {
          expect(loc.pathname).to.eq(
            '/docs/default/Component/backstage/overview/architecture-overview/',
          );
        });
      });
    });
  });
});
