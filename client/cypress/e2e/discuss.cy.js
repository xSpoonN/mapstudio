/* eslint-disable no-undef */

describe('Discussion Posts Board', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.get('img.logo').click(); // Click on logo to go to home page
      cy.contains('Discuss').click();
    })
  
    it('contains the correct buttons and options', () => {
        cy.get('input[type="text"]').should('have.length', 2); // 2 Search boxes, sitewide and discussion posts
        cy.get('div.MuiSelect-select').first().should('have.text', 'Newest')
        /* cy.get('div.MuiSelect-select').last().should('have.text', 'None') */
        cy.contains('Sort');
        /* cy.contains('Filter'); */
        cy.contains('Create');
        cy.contains('Create +');
    })
  })