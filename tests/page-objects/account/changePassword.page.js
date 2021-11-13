export default {
  get page() {
    return cy.get('[data-ft="change-password-page"]');
  },

  get oldPasswordField() {
    return cy.get('[name="oldPassword"]');
  },

  get oldPasswordValidation() {
    return cy.get('[name="oldPassword"]').parent().parent().find('.MuiFormHelperText-root');
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

  get homeLink() {
    return cy.get('[data-ft="home-link"]');
  },

  get loadingOverlay() {
    return cy.get('[data-ft="loading-backdrop"]');
  },
};
