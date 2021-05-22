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
declare module 'zombie';
declare module 'pgtools';
declare namespace Cypress {
  interface Chainable {
    /**
     * Login as guest
     * @example cy.loginAsGuests
     */
    loginAsGuest(): Chainable<Element>;
    /**
     * Get the TechDocs shadow root element
     * @example cy.getTechDocsShadowRoot
     */
    getTechDocsShadowRoot(): Chainable<Element>;
    /**
     * Mock TechDocs backend API
     * @example cy.mockTechDocs
     */
    mockTechDocs(): void;
    /**
     * Get the TechDocs table of contents element
     * @example cy.getTechDocsShadowRoot
     */
    getTechDocsTableOfContents(): Chainable<Element>;
    /**
     * Get the TechDocs navigation element
     * @example cy.getTechDocsShadowRoot
     */
    getTechDocsNavigation(): Chainable<Element>;
    /**
     * Mock Techdocs CSS
     * @example cy.getTechDocsShadowRoot
     */
    mockTechDocsCSS(): Chainable<Element>;
    /**
     * Intercept the TechDocs API calls
     * @example cy.getTechDocsShadowRoot
     */
    interceptTechDocsAPICalls(): Chainable<Element>;
    /**
     * Mock SockJS-Node call
     * @example cy.getTechDocsShadowRoot
     */
    mockSockJSNode(): Chainable<Element>;
    /**
     * Wait TechDocs API response for Backstage home page
     * @example cy.getTechDocsShadowRoot
     */
    waitHomePage(): Chainable<Element>;
    /**
     * Wait TechDocs API response for Backstage rodmap page
     * @example cy.getTechDocsShadowRoot
     */
    waitRoadmapPage(): Chainable<Element>;
  }
}
