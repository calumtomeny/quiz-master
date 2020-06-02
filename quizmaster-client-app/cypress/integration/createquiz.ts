/// <reference types="cypress" />
describe('Loading homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the host quiz form.', () => {
    cy.get('[data-testid="join-quiz"]').should('exist');
  })
  it('renders the host join form.', () => {
    cy.get('[data-testid="join-quiz"]').should('exist');
  })
})
