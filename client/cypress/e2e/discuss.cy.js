/* eslint-disable no-undef */

Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Discussion Posts Board', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('img.logo').click(); // Click on logo to go to home page
    cy.contains('Discuss').click();
    cy.viewport(1920, 1080);
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

  /* ==== Test Created with Cypress Studio ==== */
/*   it('discussion post', function() { */
    /* ==== Generated with Cypress Studio ==== */
/*     cy.get(':nth-child(1) > [style="width: 100%; font-size: 36pt;"] > .css-1wo5ipp').click();
    cy.get('.css-dtrw64 > .MuiTypography-h4').click();
    cy.get('.css-dtrw64 > .MuiTypography-body1').click();
    cy.get('.MuiAvatar-img').click();
    cy.get('.css-10zqfkr > .MuiTypography-h4').click();
    cy.get('.MuiTypography-h6').click();
    cy.get('[data-testid="ThumbUpIcon"] > path').click();
    cy.get('[data-testid="ThumbDownIcon"] > path').click(); */
    /* ==== End Cypress Studio ==== */
/*   }); */

  /* ==== Test Created with Cypress Studio ==== */
  it('create discussion post menu', function() {
    // Login
    cy.get('.css-2uchni > .MuiButtonBase-root').click();
    cy.get('[tabindex="0"] > .MuiTypography-root').click();
    cy.get('#username').clear();
    cy.get('#username').type('Kevin');
    cy.get('#password').clear();
    cy.get('#password').type('Admin456');
    cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').click(); // login
    cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').should('not.exist', { timeout: 20000 }); // wait for page to refresh
    cy.wait(100);
    cy.contains('Discuss').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.Mui-focusVisible').click();
    cy.get('.css-1jby15f > .MuiButton-root').click();
    cy.get('.css-u4p24i > .MuiFormControl-root > .MuiInputBase-root > #standard-basic').clear('as');
    cy.get('.css-u4p24i > .MuiFormControl-root > .MuiInputBase-root > #standard-basic').type('asdasdasdasd');
    cy.get('.css-12kd92j').click();
    cy.get('.css-u4p24i').click();
    cy.get('.css-1hsm21l > .MuiFormControl-root > .MuiInputBase-root > #standard-basic').clear('as');
    cy.get('.css-1hsm21l > .MuiFormControl-root > .MuiInputBase-root > #standard-basic').type('awfadsdvsverv');
    cy.get('.css-1hsm21l > .MuiTypography-root').click();
    cy.get('.css-1hsm21l > .MuiFormControl-root > .MuiInputBase-root > #standard-basic').click();
    /* ==== End Cypress Studio ==== */
  });
})