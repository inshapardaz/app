import { userLibrariesPage } from '../../page-objects';
import { logInWithoutLibrarySelection } from '../../helpers';

describe('When user has no library selected', () => {
  before(() => {
    logInWithoutLibrarySelection();

    cy.visit('/');
  });

  it('I should see library selection page', () => {
    userLibrariesPage.page.should('be.visible');
  });
});
