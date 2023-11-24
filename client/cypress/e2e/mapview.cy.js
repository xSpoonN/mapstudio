/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Map View', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.viewport(1920, 1080);
      cy.get('div.map-card').first().click();
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