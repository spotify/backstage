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
Cypress.Commands.add('enterAsGuest', () => {
  cy.visit('/');
  cy.get('button').contains('Enter').click();
});

Cypress.Commands.add('login', () => {
  window.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest');
});

Cypress.Commands.add('getTechDocsShadowRoot', () => {
  cy.get('[data-testid="techdocs-content-shadowroot"]').shadow();
});

Cypress.Commands.add('mockTechDocs', () => {
  cy.intercept(
    'GET',
    '**/techdocs/metadata/entity/default/Component/backstage',
    {
      fixture: 'techdocs/metadata-entity.json',
    },
  );

  cy.intercept(
    'GET',
    '**/techdocs/metadata/techdocs/default/Component/backstage',
    {
      fixture: 'techdocs/metadata-techdocs.json',
    },
  );

  cy.intercept('GET', '**/techdocs/sync/default/Component/backstage', {
    fixture: 'techdocs/sync.json',
  });

  // HTML
  cy.intercept(
    'GET',
    '**/techdocs/static/docs/default/Component/backstage/overview/roadmap/index.html',
    {
      fixture: 'techdocs/components/roadmap.html',
    },
  );

  cy.intercept(
    'GET',
    '**/techdocs/static/docs/default/Component/backstage/index.html',
    {
      fixture: 'techdocs/components/default.html',
    },
  );

  // CSS
  cy.intercept('GET', '**/assets/stylesheets/main.fe0cca5b.min.css', {
    fixture: 'techdocs/components/style.css',
  });
});
