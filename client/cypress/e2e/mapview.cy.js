/* eslint-disable no-undef */

describe('Map View', () => {

    beforeEach(() => {
      cy.visit('https://mapstudio-cse416.web.app/')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.viewport(1920, 1080);
      cy.get('div.map-card').click();
    })
  
    it('contains comments', () => {
        cy.contains('Comments').should('exist');
        cy.get('textarea').should('exist'); // Comment box
    })

    it('contains export buttons', () => {
        cy.contains('JSON').should('exist');
        cy.contains('PNG').should('exist');
        cy.contains('JPG').should('exist');
        cy.contains('Fork').should('exist');
    })
  })