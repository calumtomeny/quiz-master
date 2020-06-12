/// <reference types="cypress" />
describe("Creating quiz with no name", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("does not let the user progress.", () => {
    cy.get('[data-testid="create-quiz-button"]').click();

    cy.url().should("not.contain", "quiz/");
  });

  describe("Creating quiz with valid name", () => {
    beforeEach(() => {
      cy.visit("/");
    });
    it("lets the user progress.", () => {
      cy.get('[data-testid="quiz-name-input"]').type("Test Quiz");

      cy.get('[data-testid="create-quiz-button"]').click();

      cy.url().should("contain", "quiz/");
    });
  });
});
