/// <reference types="cypress" />
describe("Loading homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the host quiz form.", () => {
    cy.get('[data-testid="join-quiz"]').should("exist");
  });
  it("renders the host join form.", () => {
    cy.get('[data-testid="join-quiz"]').should("exist");
  });
});

describe("Creating quiz with no name", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("does not let the user progress.", () => {
    cy.get('[data-testid="create-quiz-button"]').click();

    cy.url().should("not.contain", "quiz/");
  });

  describe("Joining quiz with no code", () => {
    beforeEach(() => {
      cy.visit("/");
    });
    it("does not let the user progress.", () => {
      cy.get('[data-testid="join-quiz-button"]').click();

      cy.url().should("not.contain", "quiz/");
    });
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
});
