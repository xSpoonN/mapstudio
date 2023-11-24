/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Register Page', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.contains('Register').click();
    })
  
    it('contains login functions', () => {
        cy.contains('Register').should('exist');
        cy.contains('Forgot Password').should('exist');
        cy.contains('Log In').should('exist');
        cy.contains('Username').should('exist');
        cy.contains('Email').should('exist');
        cy.contains('Password').should('exist');
    })
  })