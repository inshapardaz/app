import './extension';

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  window.localStorage.setItem('useStaticImage', true);
});
