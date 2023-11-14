/* eslint-disable no-undef */

describe('Users app', () => {

  beforeEach(() => {
    cy.visit('https://mapstudio-cse416.web.app/')
  })

  it('creates a new user', () => {
    cy.get('h2').contains('Create User')
   
    cy.get('input[placeholder="Name"]').type('John')
    cy.get('input[placeholder="Age"]').type('30')
    cy.get('button').contains('Create User').click()
    
    cy.get('li').last().contains('John').contains('30')
  })

  it('updates an existing user', () => {
    cy.get('li').contains('John').first().click()

    cy.get('input[value="John"]').clear().type('Sarah') 
    cy.get('button').contains('Update').click()

    cy.get('li').contains('Sarah')
  })

  it('deletes a user', () => {
    cy.get('li').contains('Sarah').click()
   
    cy.get('button').contains('Delete').click()

    /* cy.get('li').first().should('not.contain', 'Sarah') */
    cy.contains('Sarah').should('not.exist')
  })

})