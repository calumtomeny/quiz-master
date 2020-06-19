/// <reference types="cypress" />
describe("Creating quiz with no name", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("does not let the user progress.", () => {
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.url().should("not.contain", "quiz/");
  });
});

describe("Creating quiz with valid name", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="quiz-name-input"]').type("Test Quiz");
    cy.get('[data-testid="create-quiz-button"]').click();
  });
  it("loads the quiz creation page with the initial question form", () => {
    cy.get('[data-testid="question-input"]').should("exist");
    cy.get('[data-testid="answer-input"]').should("exist");
    cy.get('[data-testid="add-question-button"]').should("exist");
  });
  it("allows for the creation of an initial question", () => {
    cy.get('[data-testid="question-input"]').type("What is 1 + 1?");
    cy.get('[data-testid="answer-input"]').type("2.");
    cy.get('[data-testid="add-question-button"]').click();
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
  });
  it("contains quiz/ in the URL", () => {
    cy.url().should("contain", "quiz/");
  });
  it.only("does not allow the quiz master to progress before adding a question", () => {
    cy.get(".MuiButton-contained").eq(1).click();
    cy.get('[data-testid="question-input"]').should("exist");
    cy.get('[data-testid="answer-input"]').should("exist");
    cy.get('[data-testid="add-question-button"]').should("exist");
  });
});

describe("The first question that is created", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="quiz-name-input"]').type("Test Quiz");
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.get('[data-testid="question-input"]').type("What is 1 + 1?");
    cy.get('[data-testid="answer-input"]').type("2.");
    cy.get('[data-testid="add-question-button"]').click();
  });
  it("can be edited", () => {
    cy.get(".MuiTableCell-paddingNone > div > :nth-child(1)").click();
    cy.get('[placeholder="Question"]').clear().type("Edited question");
    cy.get('[placeholder="Answer"]').clear().type("Edited answer");
    cy.get('[title="Save"]').click();
    cy.get("table").contains("td", "Edited question");
    cy.get("table").contains("td", "Edited answer");
  });
  it("can be deleted and takes use back to first question input", () => {
    cy.get(".MuiTableCell-paddingNone > div > :nth-child(2)").click();
    cy.get('[title="Save"]').click();
    cy.get('[data-testid="question-input"]').should("exist");
    cy.get('[data-testid="answer-input"]').should("exist");
    cy.get('[data-testid="add-question-button"]').should("exist");
  });
  it("can be added to", () => {
    cy.get(".MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorInherit")
      .first()
      .click();
    cy.get('[placeholder="Question"]').clear().type("New question");
    cy.get('[placeholder="Answer"]').clear().type("New answer");
    cy.get('[title="Save"]').click();
    cy.get("table").contains("td", "New question");
    cy.get("table").contains("td", "New answer");
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
  });
  it("allows the quiz master to progress", () => {
    cy.get(".MuiButton-contained").click();
    cy.get(".makeStyles-stepContainer-311").contains("No options yet.");
  });
});

describe("The second question that is created", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-testid="quiz-name-input"]').type("Test Quiz");
    cy.get('[data-testid="create-quiz-button"]').click();
    cy.get('[data-testid="question-input"]').type("What is 1 + 1?");
    cy.get('[data-testid="answer-input"]').type("2.");
    cy.get('[data-testid="add-question-button"]').click();
    cy.get(".MuiButtonBase-root.MuiIconButton-root.MuiIconButton-colorInherit")
      .first()
      .click();
    cy.get('[placeholder="Question"]').clear().type("New question");
    cy.get('[placeholder="Answer"]').clear().type("New answer");
    cy.get('[title="Save"]').click();
  });
  it("can be edited", () => {
    cy.get(
      '[index="1"] > .MuiTableCell-paddingNone > div > [title="Edit"]',
    ).click();
    cy.get('[placeholder="Question"]').clear().type("Edited question");
    cy.get('[placeholder="Answer"]').clear().type("Edited answer");
    cy.get('[title="Save"]').click();
    cy.get("table").contains("td", "Edited question");
    cy.get("table").contains("td", "Edited answer");
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
  });
  it("can be deleted and leaves user on question editor table", () => {
    cy.get(
      '[index="1"] > .MuiTableCell-paddingNone > div > [title="Delete"]',
    ).click();
    cy.get('[title="Save"]').click();
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
  });
  it("can be found using the search component", () => {
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
    cy.get("table").contains("td", "New question");
    cy.get("table").contains("td", "New answer");
    cy.get(".MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input")
      .first()
      .type("1 + 1");
    cy.get("table").contains("td", "What is 1 + 1?");
    cy.get("table").contains("td", "2.");
    cy.get("table").contains("td", "New question").should("not.exist");
    cy.get("table").contains("td", "New answer").should("not.exist");
  });
});
