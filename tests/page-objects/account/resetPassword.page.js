export default {
  get page() {
    return cy.get('[data-ft="reset-password-page"]');
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

  get submitButton() {
    return cy.get('[data-ft="submit-button"]');
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
