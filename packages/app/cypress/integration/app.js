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

describe('App', () => {
  it('should render the welcome page', () => {
    cy.visit('/');
    cy.contains('Welcome to Backstage');
    cy.contains('Getting Started');
    cy.contains('Quick Links');
    cy.contains('APIs');
  });

  it('should display support info when clicking the button', () => {
    cy.visit('/');
    cy.findByTestId('support-button').click({ force: true });
    cy.contains('#backstage');
  });

  it('should display error message when triggering it', () => {
    cy.visit('/');
    cy.findByTestId('error-button').click({ force: true });
    cy.contains('Error: Oh no!');
    cy.findByTestId('error-button-close').click({ force: true });
  });

  it('should be able to login and logout', () => {
    const name = 'test-name';
    Cypress.on('window:before:load', win => {
      win.fetch = cy.stub().resolves({
        status: 200,
        json: () => ({ username: 'test name', token: 'token', name }),
      });
    });

    cy.visit('/');
    cy.get('a[href="/login"]').click({ force: true });
    cy.url().should('include', '/login');
    cy.contains('Welcome, guest!');
    cy.contains('Username')
      .get('input[name=github-username-tf]')
      .type(name, { force: true });
    cy.contains('Token')
      .get('input[name=github-auth-tf]')
      .type('password', { force: true });
    cy.findByTestId('github-auth-button').click({ force: true });
    cy.contains(`Welcome, ${name}!`);
    cy.contains('Logout').click({ force: true });
    cy.contains('Welcome, guest!');
  });
});
