/* eslint-disable no-undef */
Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Profile Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('.css-2uchni > .MuiButtonBase-root').click();
    cy.get('[tabindex="0"] > .MuiTypography-root').click();
    cy.get('#username').clear();
    cy.get('#username').type('Kevin');
    cy.get('#password').clear();
    cy.get('#password').type('Admin456');
    cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').click();
    cy.get('.MuiAvatar-img').click();
    cy.get('[tabindex="0"] > .MuiTypography-root').click();
  })

  it('profile', function() {
    cy.get('.MuiTypography-body1 > div').click();
    cy.get('.MuiTypography-body1 > div').dblclick();
    cy.get('.MuiTypography-body1 > input').clear();
    cy.get('.MuiTypography-body1 > input').type('This is a bio');
    cy.get('.MuiGrid-grid-md-4 > .MuiPaper-root').click();
    cy.get('.MuiTypography-body1 > div').contains('This is a bio');
    cy.get('.MuiTypography-body1 > div').click();
    cy.get('.MuiTypography-body1 > div').dblclick();
    cy.get('.MuiTypography-body1').click();
    cy.get('.MuiTypography-body1 > input').clear();
    cy.get('.MuiTypography-body1 > input').type('o7');
    cy.get('.MuiGrid-grid-md-4 > .MuiPaper-root').click();
    cy.get('.MuiTypography-body1 > div').contains('o7');
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('goes to discussions on click more arrow', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="ArrowRightIcon"] > path').click();
    cy.get('.MuiTypography-h2').click();
    /* ==== End Cypress Studio ==== */
  });
})