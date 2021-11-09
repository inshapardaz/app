export default {
  get page() {
    return cy.get('[data-ft="forget-password-page"]');
  },

  get emailField() {
    return cy.get('[name="email"]');
  },

  get emailValidation() {
    return cy.get('[name="email"]').parent().parent().find('.MuiFormHelperText-root');
  },

  get submitButton() {
    return cy.get('[data-ft="submit-button"]');
  },

  get loginLink() {
    return cy.get('[data-ft="login-link"]');
  },
};
