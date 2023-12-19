/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Map View', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.viewport(1920, 1080);
    })
  
    it('contains comments', () => {
        cy.get('div.map-card').first().click();
        cy.contains('Comments').should('exist');
        cy.get('textarea').should('exist'); // Comment box
    })

    it('contains export buttons', () => {
        cy.get('div.map-card').first().click();
        cy.contains('JSON').should('exist');
        cy.contains('PNG').should('exist');
        cy.contains('JPG').should('exist');
        cy.contains('Fork').should('not.exist'); // not logged in
    })

    it('contains fork on login', () => {
        cy.get('.css-2uchni > .MuiButtonBase-root').click();
        cy.get('[tabindex="0"] > .MuiTypography-root').click();
        cy.get('#username').clear();
        cy.get('#username').type('Kevin');
        cy.get('#password').clear();
        cy.get('#password').type('Admin456');
        cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').click(); // login
        cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').should('not.exist', { timeout: 20000 }); // wait for page to refresh
        cy.wait(100);
        cy.get('div.map-card').last().click();
        cy.contains('Fork').should('exist');
    })
  })