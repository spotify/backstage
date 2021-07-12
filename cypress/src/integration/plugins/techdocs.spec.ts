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
/// <reference types="cypress" />
import 'os';

describe('TechDocs', () => {
  beforeEach(() => {
    cy.loginAsGuest();
    cy.mockTechDocsCSS();
    cy.mockSockJSNode();
    cy.interceptTechDocsAPICalls();
  });

  describe('Navigating to TechDocs', () => {
    it('should navigate to the TechDocs home page via the primary navigation bar', () => {
      cy.visit('/');
      cy.wait(500);

      cy.get('[data-testid="sidebar-root"]')
        .get('div')
        .get('a[href="/docs"]')
        .click();

      cy.contains('Documentation');
    });

    it('should navigate to the TechDocs home page from the URL', () => {
      cy.visit('/docs');

      cy.wait(500);

      cy.contains('Documentation');
    });

    it('should navigate to a specific TechDocs entity from the "Overview" tab', () => {
      cy.visit('/docs');
      cy.contains('techdocs-e2e-fixture')
        .parents()
        .eq(2)
        .contains('Read Docs')
        .click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq(
          '/docs/default/Component/techdocs-e2e-fixture',
        );
      });
    });

    it('should navigate to a specific TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');
      cy.waitHomePage();

      cy.contains('e2e Fixture Documentation');
      cy.contains(
        'Documentation used for end-to-end tests of TechDocs in Backstage.',
      );
      cy.getTechDocsShadowRoot().contains('Home page');
    });

    it('should navigate to a specific TechDocs section from a URL', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture/sub-page-two');
      cy.waitSectionTwoPage();

      cy.window().its('scrollY').should('equal', 0);

      cy.getTechDocsShadowRoot().within(() => {
        cy.contains('Sub-page 2');
      });
    });

    it('should navigate to a specific TechDocs fragment from a URL', () => {
      cy.visit(
        '/docs/default/Component/techdocs-e2e-fixture/sub-page-two#section-23',
      );
      cy.waitSectionTwoPage();

      // This is used to test the post-render behavior of the techdocs Reader
      cy.wait(500);

      cy.getTechDocsShadowRoot().within(() => {
        cy.isInViewport('#section-23');
      });
    });

    it('should navigate to a wrong TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/wrong-component');

      cy.get('[data-testid=error]').should('be.visible');
    });
  });

  describe('Navigating within TechDocs', () => {
    it('should navigate to a specific TechDocs page via the navigation bar', () => {
      cy.visit('/docs/default/Component/techdocs-e2e-fixture');
      cy.waitHomePage();

      cy.getTechDocsShadowRoot().within(() => {
        cy.getTechDocsNavigation()
          .find('> div > div > [data-md-level="0"] > ul > li:nth-child(2) > a')
          .click();
        cy.contains('Sub-page 1');
        cy.window().its('scrollY').should('eq', 0);
      });
    });

    describe('Navigating within a TechDocs page', () => {
      beforeEach(() => {
        cy.visit('/docs/default/Component/techdocs-e2e-fixture/sub-page-two');
        cy.waitSectionTwoPage();
      });
      it('should navigate to a specific fragment within the page via the table of contents - Level 1', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          // Section 3
          cy.getTechDocsTableOfContents().within(() => {
            cy.get('> div > div > nav > ul > li:nth-child(3) > a').click();
          });

          cy.isInViewport('#section-23');
        });
      });

      it('should navigate to a specific fragment within the page via the table of contents - Level 2', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.isNotInViewport('#sub-section-222');
          // Section 2.2
          cy.getTechDocsTableOfContents()
            .find(
              '> div > div > nav > ul > li:nth-child(2) > nav > ul > li:nth-child(2) > a',
            )
            .click();

          cy.isInViewport('#sub-section-222');
        });
      });

      it('should navigate to a specific TechDocs page fragment from a link', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-content > article')
            .contains('Link to Section 1.1')
            .click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-one/',
            );
            expect(loc.hash).to.eq('#section-11');
          });
        });
      });

      it('should navigate to the next page within a TechDocs entity', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-footer-nav__link--next').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-three/',
            );
          });
        });
      });

      it('should navigate to the previous page within a TechDocs entity', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-footer-nav__link--prev').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/techdocs-e2e-fixture/sub-page-one/',
            );
          });
        });
      });
    });
  });
});
