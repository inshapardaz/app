import { loginPage } from '../../page-objects';

describe('When user is not signed in ', () => {
  before(() => {
    cy.visit('/');
  });

  it('I should be redirected to login page', () => {
    loginPage.page.should('exist');
  });
});
