/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Login Page', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.viewport(1920, 1080);
    })
  
    it('contains login functions', () => {
        cy.get('button:contains(Log In)').last().click();
        cy.contains('Create Account').should('exist');
        cy.contains('Forgot Password').should('exist');
        cy.contains('Log In').should('exist');
        cy.contains('Username').should('exist');
        cy.contains('Password').should('exist');
    })
  })