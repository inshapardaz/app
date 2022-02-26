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

  it('I should see the list of libraries', () => {
    userLibrariesPage.libraries[0].name.shouldHaveText('Test');
    userLibrariesPage.libraries[0].language.shouldHaveText('English');

    userLibrariesPage.libraries[1].name.shouldHaveText('بچوں کی دنیا');
    userLibrariesPage.libraries[1].language.shouldHaveText('اردو');
  });

  describe('and I click on the library', () => {
    before(() => {
      userLibrariesPage.libraries[0].selectButton.click();
    });
  });
});
