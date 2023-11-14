/* eslint-disable no-undef */

describe('Login Page', () => {

    beforeEach(() => {
      cy.visit('https://mapstudio-cse416.web.app/')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.contains('Log In').click();
    })
  
    it('contains login functions', () => {
        cy.contains('Create Account').should('exist');
        cy.contains('Forgot Password').should('exist');
        cy.contains('Log In').should('exist');
        cy.contains('Username').should('exist');
        cy.contains('Password').should('exist');
    })
  })