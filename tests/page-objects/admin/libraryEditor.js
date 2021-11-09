import MuiCheckBox from '../controls/muiCheckBox';

export default {
  get page() {
    return cy.get('[data-ft="edit-library-page"]');
  },

  get ownerEmailField() {
    return cy.get('[name="ownerEmail"]');
  },

  get ownerEmailValidation() {
    return cy.get('[name="ownerEmail"]').parent().parent().find('.Mui-error');
  },
  get nameField() {
    return cy.get('[name="name"]');
  },

  get nameValidation() {
    return cy.get('[name="name"]').parent().parent().find('.Mui-error');
  },
  get languageField() {
    return cy.get('[data-ft="language"]');
  },

  get primaryColorField() {
    return cy.get('[data-ft="primary-color"]');
  },

  get secondaryColorField() {
    return cy.get('[data-ft="secondary-color"]');
  },

  get supportsPeriodicalsCheckbox() {
    return new MuiCheckBox('[name="supportsPeriodicals"]');
  },

  get submitButton() {
    return cy.get('#submitButton');
  },
  get cancelButton() {
    return cy.get('#cancelButton');
  },
};
