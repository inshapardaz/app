import { libraryEditorPage, adminLibrariesPage } from '../../../page-objects';
import { loginAsAdmin } from '../../../helpers';

describe('When I go to create library page', () => {
  before(() => {
    loginAsAdmin();

    cy.visit('/admin/libraries/create');
    cy.get('[data-ft="page-loading"]').should('not.be.visible', { timeout: 60000 });
  });

  it('I should see the library editor page', () => {
    libraryEditorPage.page.should('exist');
  });

  it('I should see the empty form', () => {
    libraryEditorPage.ownerEmailField.should('be.visible');
    libraryEditorPage.nameField.should('be.visible');
    libraryEditorPage.languageField.should('be.visible');
    libraryEditorPage.primaryColorField.should('be.visible');
    libraryEditorPage.secondaryColorField.should('be.visible');
    libraryEditorPage.supportsPeriodicalsCheckbox.control.should('be.visible');
  });

  describe('and I try create the library without providing email and name', () => {
    before(() => {
      libraryEditorPage.submitButton.click();
    });

    it('I should see the email validation message', () => {
      adminLibrariesPage.ownerEmailValidation.should('be.visible');
    });
  });
});
