import { loginPage, notifications } from '../../page-objects';

import { libraryMock, authenticationMock } from '../../mock';

describe('When user is not signed in ', () => {
  before(() => {
    cy.visit('account/login');
  });

  it('I should be redirected to login page', () => {
    loginPage.page.should('exist');
  });

  it('I should see the empty login form', () => {
    loginPage.emailField.should('be.visible');
    loginPage.emailField.should('have.value', '');
    loginPage.passwordField.should('be.visible');
    loginPage.passwordField.should('have.value', '');
  });

  it('I should see a login button', () => {
    loginPage.loginButton.should('be.visible');
    loginPage.loginButton.shouldHaveText('Login');
  });

  it('I should see register link', () => {
    loginPage.registerLink.should('be.visible');
    loginPage.registerLink.shouldHaveLink('account/register');
  });

  it('I should see forget password link', () => {
    loginPage.forgetPasswordLink.should('be.visible');
    loginPage.forgetPasswordLink.shouldHaveLink('account/forgot-password');
  });
});

describe('and I try to login without providing username and password', () => {
  before(() => {
    cy.visit('account/login');
    loginPage.loginButton.click();
  });

  it('I should still be on login page', () => {
    loginPage.page.should('exist');
  });

  it('I should see email validation error', () => {
    loginPage.emailValidation.should('be.visible');
    loginPage.emailValidation.shouldHaveText('Email is required');
  });

  it('I should see password validation error', () => {
    loginPage.passwordValidation.should('be.visible');
    loginPage.passwordValidation.shouldHaveText('Password is required');
  });
});

describe('and I try to login without providing valid email', () => {
  before(() => {
    cy.visit('account/login');

    loginPage.emailField.type('sometexthere');
    loginPage.passwordField.type('sometext');
    loginPage.loginButton.click();
  });

  it('I should still be on login page', () => {
    loginPage.page.should('exist');
  });

  it('I should see email validation error', () => {
    loginPage.emailValidation.should('be.visible');
    loginPage.emailValidation.shouldHaveText('Email is invalid');
  });

  it('I should not see password validation error', () => {
    loginPage.passwordValidation.should('not.exist');
  });
});

describe('and I try to login providing username and password and server returns error', () => {
  before(() => {
    authenticationMock.mockLoginFailure();
    cy.visit('account/login');

    loginPage.emailField.type('aa@bb.cc');
    loginPage.passwordField.type('sometext');
    loginPage.loginButton.click();
  });

  it('I should be on login page', () => {
    loginPage.page.should('exist');
  });

  it('I should show error', () => {
    notifications.errorMessage.shouldHaveText('Unable to login. Please check your username and password.');
  });
});

describe('and I try to login and it takes a while', () => {
  before(() => {
    authenticationMock.mockLoginSlow('/account/token.json');
    cy.visit('account/login');

    loginPage.emailField.type('aa@bb.cc');
    loginPage.passwordField.type('sometext');
    loginPage.loginButton.click();
  });

  it('I should see controls disabled', () => {
    loginPage.loadingOverlay.should('be.visible');
  });
});

describe('and I try to login providing username and password', () => {
  before(() => {
    authenticationMock.mockLogin('/account/token.json');
    authenticationMock.mockTokenRefresh();
    libraryMock.mockEntry();
    cy.visit('account/login');

    loginPage.emailField.type('aa@bb.cc');
    loginPage.passwordField.type('sometext');
    loginPage.loginButton.click();
  });

  it('I should be redirected out of login page', () => {
    cy.url().should('not.eq', 'account/login');
  });
});
