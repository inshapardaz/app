import { forgetPasswordPage, loginPage, notifications } from '../../page-objects';

import { authenticationMock } from '../../mock';

describe('When I visit forget password page ', () => {
  before(() => {
    cy.visit('account/forgot-password');
  });

  it('I should see forget password page', () => {
    forgetPasswordPage.page.should('exist');
  });

  it('I should see the empty login form', () => {
    forgetPasswordPage.emailField.should('be.visible');
    forgetPasswordPage.emailField.should('have.value', '');
  });

  it('I should see a submit button', () => {
    forgetPasswordPage.submitButton.should('be.visible');
    forgetPasswordPage.submitButton.shouldHaveText('Get Password');
  });

  it('I should see login link', () => {
    forgetPasswordPage.loginLink.should('be.visible');
    forgetPasswordPage.loginLink.shouldHaveLink('account/login');
  });
});

describe('When I try to submit without providing username', () => {
  before(() => {
    cy.visit('account/forgot-password');
    forgetPasswordPage.submitButton.click();
  });

  it('I should still be on forget password page', () => {
    forgetPasswordPage.page.should('exist');
  });

  it('I should see email validation error', () => {
    forgetPasswordPage.emailValidation.should('be.visible');
    forgetPasswordPage.emailValidation.shouldHaveText('Email is required');
  });
});

describe('When I try to login without providing valid email', () => {
  before(() => {
    cy.visit('account/forgot-password');

    forgetPasswordPage.emailField.type('sometexthere');
    forgetPasswordPage.submitButton.click();
  });

  it('I should still be on forgot password page', () => {
    forgetPasswordPage.page.should('exist');
  });

  it('I should see email validation error', () => {
    forgetPasswordPage.emailValidation.should('be.visible');
    forgetPasswordPage.emailValidation.shouldHaveText('Email is invalid');
  });
});

describe('When I try to get forgotten password and server returns error', () => {
  before(() => {
    authenticationMock.mockForgotPasswordFailure();
    cy.visit('account/forgot-password');

    forgetPasswordPage.emailField.type('aa@bb.cc');
    forgetPasswordPage.submitButton.click();
  });

  it('I should still be on forgot password page', () => {
    forgetPasswordPage.page.should('exist');
  });

  it('I should show error', () => {
    notifications.errorMessage.shouldHaveText('Unable to complete request. Please try again.');
  });
});

describe('When I try to get forgotten password', () => {
  before(() => {
    authenticationMock.mockForgotPassword();
    cy.visit('account/forgot-password');

    forgetPasswordPage.emailField.type('aa@bb.cc');
    forgetPasswordPage.submitButton.click();
  });

  it('I should be redirected to login page', () => {
    loginPage.page.should('exist');
  });

  it('I should show error', () => {
    notifications.successMessage.shouldHaveText('Please check your email for password reset instructions.');
  });
});
