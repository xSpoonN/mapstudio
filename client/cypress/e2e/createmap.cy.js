/* eslint-disable no-undef */

describe('Create Map', () => {

    beforeEach(() => {
      cy.visit('https://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.contains('Create').click();
      cy.viewport(1920, 1080);
    })
  
    it('contains toolbars', () => {
        cy.contains('Import').should('exist');
        cy.contains('Export').should('exist');
        cy.contains('Publish').should('exist');
        cy.contains('Delete').should('exist');
        cy.contains('Map Info').should('exist');
        cy.contains('Subdivision Info').should('exist');
        cy.contains('Point Info').should('exist');
        cy.contains('Bin Info').should('exist');
        cy.contains('Gradient Info').should('exist');
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
        cy.contains('Subdivision Info').click();
        cy.contains('Subdivision Data').should('exist');
        cy.contains('Name').should('exist');
        cy.contains('Weight').should('exist');
        cy.contains('Color').should('exist');
        cy.get('input[type="text"]').should('have.length', 4); // 1 Search box, name box, property box, weight box
        cy.contains('Add New Property').should('exist');
    })

    it('contains point info sidebar', () => {
        cy.contains('Point Info').click();
        cy.contains('Point Data').should('exist');
        cy.contains('Name').should('exist');
        cy.contains('Size').should('exist');
        cy.contains('Color').should('exist');
        cy.get('input[type="text"]').should('have.length', 4); // 1 Search box, name box, property box, weight box
        cy.contains('Add New Property').should('exist');
        cy.contains('Move Point').should('exist');
        cy.contains('Delete Point').should('exist');
    })

    it('contains bin info sidebar', () => {
        cy.contains('Bin Info').click();
        cy.contains('Bin Data').should('exist');
        cy.contains('+ New Bin').should('exist');
    })
    
    it('contains gradient info sidebar', () => {
        cy.contains('Gradient Info').click();
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