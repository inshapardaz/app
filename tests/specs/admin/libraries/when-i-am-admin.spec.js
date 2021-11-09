import { adminLibrariesPage } from '../../../page-objects';
import { loginAsAdmin } from '../../../helpers';

describe('When I visit administration libraries page as normal user', () => {
  before(() => {
    loginAsAdmin();

    cy.visit('/admin/libraries');
    cy.get('[data-ft="page-loading"]').should('not.be.visible', { timeout: 60000 });
  });

  it('I should see the libraries', () => {
    adminLibrariesPage.page.should('exist');
  });

  it('I should see create library link', () => {
    adminLibrariesPage.addButton.should('exist');
    adminLibrariesPage.addButton.shouldHaveLink('/admin/libraries/create');
  });

  it('I should see existing libraries', () => {
    adminLibrariesPage.addButton.should('exist');
    adminLibrariesPage.addButton.shouldHaveLink('/admin/libraries/create');
  });
});
