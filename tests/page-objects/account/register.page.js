import MuiCheckBox from '../controls/muiCheckBox';

export default {
  get page() {
    return cy.get('[data-ft="register-page"]');
  },

  get nameField() {
    return cy.get('[name="name"]');
  },

  get nameValidation() {
    return cy.get('[name="name"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get passwordField() {
    return cy.get('[name="password"]');
  },

  get passwordValidation() {
    return cy.get('[name="password"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get confirmPasswordField() {
    return cy.get('[name="confirmPassword"]');
  },

  get confirmPasswordValidation() {
    return cy.get('[name="confirmPassword"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get acceptTermsCheckbox() {
    return new MuiCheckBox('[name="acceptTerms"]');
  },

  get acceptTermsCheckboxValidation() {
    return cy.get('[data-ft="acceptTerms-error"]');
  },

  get registerButton() {
    return cy.get('[data-ft="register-button"]');
  },

  get loginLink() {
    return cy.get('[data-ft="login-link"]');
  },

  get forgetPasswordLink() {
    return cy.get('[data-ft="forget-password-link"]');
  },

  get errorMessage() {
    return cy.get('.SnackbarItem-message');
  },

  get loadingOverlay() {
    return cy.get('[data-ft="loading-backdrop"]');
  },
};
