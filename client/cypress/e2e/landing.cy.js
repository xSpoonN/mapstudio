/* eslint-disable no-undef */

describe('Landing Page', () => {

    beforeEach(() => {
      cy.visit('https://mapstudio-cse416.web.app/')
      cy.get('img.logo').click(); // Click on logo to go to home page
    })
  
    it('contains login and register', () => {
        cy.contains('Log In').should('be.visible');
        cy.contains('Register').should('be.visible');
        cy.get('div.map-card').should('exist');
    })
  })