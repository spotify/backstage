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
      cy.get('[data-testid="sidebar-root"]')
        .get('div')
        .get('a[href="/docs"]')
        .click();

      cy.contains('Documentation');
    });

    it('should navigate to the TechDocs home page from the URL', () => {
      cy.visit('/docs');
      cy.contains('Documentation');
    });

    it('should navigate to a specific TechDocs entity from the "Overview" tab', () => {
      cy.visit('/docs');
      cy.get('[data-testid="read_docs"]').eq(0).click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/docs/default/Component/backstage');
      });
    });

    it('should navigate to a specific TechDocs entity from the "Owned documents" tab', () => {
      cy.visit('/docs');
      cy.get('[data-testid="header-tab-1"]').click();
      cy.get('[value="backstage"] > div > a').click();

      cy.location().should(loc => {
        expect(loc.pathname).to.eq('/docs/default/Component/backstage');
      });
    });

    it('should navigate to a specific TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/backstage');
      cy.waitHomePage();

      cy.contains('Backstage');
      cy.contains(
        'Main documentation for Backstage features and platform APIs',
      );
      cy.getTechDocsShadowRoot().contains(
        'The Backstage documentation is available at',
      );
    });

    it('should navigate to a specific TechDocs section from a URL', () => {
      cy.visit('/docs/default/Component/backstage/overview/roadmap');
      cy.waitRoadmapPage();

      cy.window().its('scrollY').should('equal', 0);

      cy.getTechDocsShadowRoot().within(() => {
        cy.contains('Phases');
        cy.contains('Detailed roadmap');
      });
    });

    it('should navigate to a specific TechDocs fragment from a URL', () => {
      cy.visit(
        '/docs/default/Component/backstage/overview/roadmap/#future-work',
      );
      cy.waitRoadmapPage();

      // This is used to test the post-render behavior of the techdocs Reader
      cy.wait(500);

      return cy.getTechDocsShadowRoot().within(() => {
        cy.get('#future-work').then($el => {
          cy.window()
            .its('scrollY')
            .should($scrollY => {
              expect($scrollY).to.be.closeTo($el[0].offsetTop, 200);
            });
        });
      });
    });

    it('should navigate to a wrong TechDocs entity page from a URL', () => {
      cy.visit('/docs/default/Component/wrong-component');

      cy.get('[data-testid=error]').should('be.visible');
    });
  });

  describe('Navigating within TechDocs', () => {
    it('should navigate to a specific TechDocs page via the navigation bar', () => {
      cy.visit('/docs/default/Component/backstage');
      cy.waitHomePage();

      cy.getTechDocsShadowRoot().within(() => {
        const overviewNavigation = cy
          .getTechDocsNavigation()
          .find('> div > div > [data-md-level="0"] > ul > li:nth-child(1)');
        overviewNavigation.within(() => {
          // Overview
          cy.get('> input').click({ force: true });
        });
        overviewNavigation.within(() => {
          // Project Roadmap
          cy.get('> [data-md-level="1"] > ul > li:nth-child(3) > a').click();
        });
        cy.contains('Phases');
        cy.contains('Detailed roadmap');
      });
    });

    describe('Navigating within a TechDocs page', () => {
      beforeEach(() => {
        cy.visit('/docs/default/Component/backstage/overview/roadmap');
        cy.waitRoadmapPage();
      });
      it('should navigate to a specific fragment within the page via the table of contents - Level 1', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          // Phases
          cy.getTechDocsTableOfContents().within(() => {
            cy.get('> div > div > nav > ul > li:nth-child(2) > a').click();
          });

          cy.get('#phases').then($el => {
            cy.window()
              .its('scrollY')
              .should($scrollY => {
                expect($scrollY).to.be.closeTo($el[0].offsetTop, 200);
              });
          });
        });
      });

      it('should navigate to a specific fragment within the page via the table of contents - Level 2', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          // Future work
          cy.getTechDocsTableOfContents()
            .find(
              '> div > div > nav > ul > li:nth-child(3) > nav > ul > li:nth-child(2) > a',
            )
            .click();

          cy.get('#future-work').then($el => {
            cy.window()
              .its('scrollY')
              .should($scrollY => {
                expect($scrollY).to.be.closeTo($el[0].offsetTop, 200);
              });
          });
        });
      });

      it('should navigate to a specific TechDocs page fragment from a link', () => {
        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-content > article')
            .contains('upgrade their installation')
            .click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/backstage/cli/commands/',
            );
            expect(loc.hash).to.eq('#versionsbump');
          });
        });
      });

      it('should navigate to the next page within a TechDocs entity', () => {
        cy.scrollTo('bottom');

        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-footer-nav__link--next').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/backstage/overview/vision/',
            );
          });
        });
      });

      it('should navigate to the previous page within a TechDocs entity', () => {
        cy.scrollTo('bottom');

        return cy.getTechDocsShadowRoot().within(() => {
          cy.get('.md-footer-nav__link--prev').click();

          cy.location().should(loc => {
            expect(loc.pathname).to.eq(
              '/docs/default/Component/backstage/overview/architecture-overview/',
            );
          });
        });
      });
    });
  });
});
