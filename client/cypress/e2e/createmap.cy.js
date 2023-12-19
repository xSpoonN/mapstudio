/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Create Map', () => {

    beforeEach(() => { // log in before each test
        cy.visit('http://localhost:3000')
        cy.get('.css-2uchni > .MuiButtonBase-root').click();
        cy.get('[tabindex="0"] > .MuiTypography-root').click();
        cy.get('#username').clear();
        cy.get('#username').type('Kevin');
        cy.get('#password').clear();
        cy.get('#password').type('Admin456');
        cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').click(); // login
        cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').should('not.exist', { timeout: 10000 }); // wait for page to refresh
        cy.contains('button', 'Create').click();
        cy.viewport(1920, 1080);
    })
  
    it('contains toolbars', () => {
        cy.contains('Import').should('exist');
        cy.contains('Export').should('exist');
        cy.contains('Publish').should('exist');
        cy.contains('Delete').should('exist');
        cy.contains('Map Info').should('exist');
        cy.contains('Subdivisions').should('exist');
        cy.contains('Points').should('exist');
        cy.contains('Bins').should('exist');
        cy.contains('Gradients').should('exist');
        cy.contains('Templates').should('exist');
    })

    it('contains map info sidebar', () => {
        cy.contains('Map Info').click();
        cy.contains('Title').should('exist');
        cy.contains('Description').should('exist');
        cy.contains('Satellite View').should('exist');
        cy.get('input[type="text"]').should('have.length', 2); // 1 Search box, 1 title box
        cy.get('textarea').should('exist'); // Description box
        cy.get('input[type="checkbox"]').should('exist'); // Satellite View checkbox
    })

    it('contains subdivision info sidebar', () => {
        cy.contains('Subdivisions').click();
        cy.contains('All Subdivisions').should('exist');
    })

    it('contains point info sidebar', () => {
        cy.contains('Points').click();
        cy.contains('All Points').should('exist');
    })

    it('contains bin info sidebar', () => {
        cy.contains('Bins').click();
        cy.contains('Bin Data').should('exist');
        cy.contains('+ New Bin').should('exist');
    })
    
    it('contains gradient info sidebar', () => {
        cy.contains('Gradients').click();
        cy.contains('Gradient Data').should('exist');
        cy.contains('+ New Gradient').should('exist');
    })

    it('contains templates sidebar', () => {
        cy.contains('Templates').click();
        cy.contains("Bin Map").should("exist")
        cy.contains("Point Map").should("exist")
        cy.contains("Gradient Map").should("exist")
        cy.contains("Heat Map").should("exist")
        cy.contains("Satellite Map").should("exist")

    })

  })
