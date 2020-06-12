/// <reference types="cypress" />
describe("Joining quiz with no code", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("does not let the user progress.", () => {
    cy.get('[data-testid="join-quiz-button"]').click();

    cy.url().should("not.contain", "quiz/");
  });
});

describe("Joining quiz via link", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("loads the quiz joining screen.", () => {
    cy.get('[data-testid="quiz-name-input"]').type("Test Quiz");
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.get('[data-testid="quiz-url"]').click();
    cy.get('[data-testid="participant-name-input"]').should("exist");
  });
});
