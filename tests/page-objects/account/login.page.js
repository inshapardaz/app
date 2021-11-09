export default {
  get page() {
    return cy.get('[data-ft="login-page"]');
  },

  get emailField() {
    return cy.get('[name="email"]');
  },

  get emailValidation() {
    return cy.get('[name="email"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get passwordField() {
    return cy.get('[name="password"]');
  },

  get passwordValidation() {
    return cy.get('[name="password"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get loginButton() {
    return cy.get('[data-ft="login-button"]');
  },

  get registerLink() {
    return cy.get('[data-ft="register-link"]');
  },

  get forgetPasswordLink() {
    return cy.get('[data-ft="forget-password-link"]');
  },

  get loadingOverlay() {
    return cy.get('[data-ft="loading-backdrop"]');
  },
};
