// ***********************************************
// Custom Cypress commands
// ***********************************************

// Login command for E2E tests
Cypress.Commands.add("login", (username: string, password: string) => {
  cy.visit("/");
  cy.get('input[type="text"]').first().type(username);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Switch language
Cypress.Commands.add("switchLanguage", (lang: "fr" | "ar") => {
  cy.contains("button", lang === "fr" ? "FR" : "AR").click();
  cy.wait(500);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      switchLanguage(lang: "fr" | "ar"): Chainable<void>;
    }
  }
}

export {};
