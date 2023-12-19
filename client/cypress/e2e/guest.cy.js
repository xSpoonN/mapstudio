/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('guest restrictions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('img.logo').click(); // Click on logo to go to home page
    cy.viewport(1920, 1080);
  })

  it('fork brings guest to login page', () => {
    cy.contains('Browse').click();
    cy.contains('italy is on fire').click();
    cy.contains('Fork').click();
    cy.contains('Welcome Back!').should('be.visible');
  })

  it('create map brings guest to login page', () => {
    cy.contains('Create').click();
    cy.contains('Welcome Back!').should('be.visible');
  })

  it('create post brings guest to login page', () => {
    cy.contains('Discuss').click();
    cy.contains('Create +').click();
    cy.contains('Welcome Back!').should('be.visible');
  })
})