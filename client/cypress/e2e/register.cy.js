/* eslint-disable no-undef */

describe('Register Page', () => {

    beforeEach(() => {
      cy.visit('https://mapstudio-cse416.web.app/')
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