export default {
  get errorMessage() {
    return cy.get('.SnackbarItem-message');
  },
  get successMessage() {
    return cy.get('.SnackbarItem-message');
  },
};
