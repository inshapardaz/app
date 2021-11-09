import { resetPasswordPage, loginPage, notifications } from '../../page-objects';
import { authenticationMock } from '../../mock';

describe('When I visit forget password page ', () => {
  before(() => {
    cy.visit('account/reset-password?code=qweqrwrewr');
  });

  it('I should be see register page', () => {
    resetPasswordPage.page.should('exist');
  });

  it('I should see the empty register form', () => {
    resetPasswordPage.passwordField.should('be.visible');
    resetPasswordPage.passwordField.should('have.value', '');
    resetPasswordPage.confirmPasswordField.should('be.visible');
    resetPasswordPage.confirmPasswordField.should('have.value', '');
  });

  it('I should see a register button', () => {
    resetPasswordPage.submitButton.should('be.visible');
    resetPasswordPage.submitButton.shouldHaveText('Reset Password');
  });

  it('I should see login link', () => {
    resetPasswordPage.loginLink.should('be.visible');
    resetPasswordPage.loginLink.shouldHaveLink('account/login');
  });

  it('I should see forget password link', () => {
    resetPasswordPage.forgetPasswordLink.should('be.visible');
    resetPasswordPage.forgetPasswordLink.shouldHaveLink('account/forgot-password');
  });
});

describe('When I visit forget password page without code', () => {
  before(() => {
    cy.visit('account/reset-password?code=qweqrwrewr');
  });

  it('I should be see reset password page', () => {
    resetPasswordPage.page.should('exist');
  });
});

describe('When I try to reset password without providing password', () => {
  before(() => {
    cy.visit('account/reset-password?code=qweqrwrewr');
    resetPasswordPage.submitButton.click();
  });

  it('I should be see register page', () => {
    resetPasswordPage.page.should('exist');
  });

  it('I should see password validation error', () => {
    resetPasswordPage.passwordValidation.should('be.visible');
    resetPasswordPage.passwordValidation.shouldHaveText('Password is required');
  });

  it('I should see confirm password validation error', () => {
    resetPasswordPage.confirmPasswordValidation.should('be.visible');
    resetPasswordPage.confirmPasswordValidation.shouldHaveText('Confirm Password is required');
  });
});

describe('When I try to reset password with different password and confirm password', () => {
  before(() => {
    cy.visit('account/reset-password?code=qweqrwrewr');
    resetPasswordPage.passwordField.type('sometext');
    resetPasswordPage.confirmPasswordField.type('some other text');
    resetPasswordPage.submitButton.click();
  });

  it('I should be see register page', () => {
    resetPasswordPage.page.should('exist');
  });

  it('I should see validation error', () => {
    resetPasswordPage.confirmPasswordValidation.should('be.visible');
    resetPasswordPage.confirmPasswordValidation.shouldHaveText('Passwords must match');
  });
});

describe('When I try to reset password and there is error registering', () => {
  before(() => {
    authenticationMock.mockPasswordResetFailure();
    cy.visit('account/reset-password?code=qweqrwrewr');
    resetPasswordPage.passwordField.type('sometext');
    resetPasswordPage.confirmPasswordField.type('sometext');
    resetPasswordPage.submitButton.click();
  });

  it('I should be see register page', () => {
    resetPasswordPage.page.should('exist');
  });

  it('I should see error', () => {
    notifications.errorMessage.shouldHaveText('Error resetting password. Please try again.');
  });
});

describe('When I reset password successfully', () => {
  before(() => {
    authenticationMock.mockPasswordReset();
    cy.visit('account/reset-password?code=4434234');
    resetPasswordPage.passwordField.type('sometext');
    resetPasswordPage.confirmPasswordField.type('sometext');
    resetPasswordPage.submitButton.click();
  });

  it('I should be on login page', () => {
    loginPage.page.should('exist');
  });

  it('I should see success message', () => {
    notifications.successMessage.shouldHaveText('Password reset successful, you can now login');
  });
});
