Cypress.on('uncaught:exception', (err, runnable) => { return false })
describe('Operating Map file', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('img.logo').click(); // Click on logo to go to home page
        cy.get('.css-2uchni > .MuiButtonBase-root').click();
        cy.get('[tabindex="0"] > .MuiTypography-root').click();
        cy.get('#username').clear();
        cy.get('#username').type('2923');
        cy.get('#password').clear();
        cy.get('#password').type('789456Qw');
        cy.get('.css-p2ochh > .MuiBox-root > .MuiButtonBase-root').click();
        cy.get('button.account-circle').click();
        cy.get('.MuiMenuItem-root').contains('Personal Maps').click();
    })
  
    it('Import map file ', () => {
        cy.get('button').contains('Create +').click();
        cy.contains('Import').click();
        cy.get('input[type="file"]').attachFile('testUploadFile.kml');
    });

    it('Publish map file ', () => {
        cy.get('.MuiPaper-root.map-card').first().click();
        cy.get('button').contains('Publish').click();
        cy.get('#dialog-no-button').click();
    });

    it('Export map file ', () => {
        cy.contains('.MuiTypography-h6', 'Public').parents('.MuiCard-root').click();
        cy.get('button').contains('JSON').click();
    });

    it('Delete map file ', () => {
        cy.get('button').contains('Create +').click();
        cy.contains('Delete').click();
    });

    it('Edit map file ', () => {
        cy.get('.MuiPaper-root.map-card').first().click();
        cy.get('button').contains('Map Info').click();
        cy.get('label').contains('Title').parent().find('input').clear().type('test title');
        cy.get('label').contains('Satellite View').parent().find('input[type="checkbox"]').check();
    });

  })
