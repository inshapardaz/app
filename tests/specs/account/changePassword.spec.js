import {
  changePasswordPage, homePage, loginPage, notifications,
} from '../../page-objects';
import { authenticationMock } from '../../mock';
import { logIn } from '../../helpers';

describe('When I visit change password page ', () => {
  before(() => {
    logIn();
    cy.visit('account/change-password');
  });

  it('I should be see register page', () => {
    changePasswordPage.page.should('exist');
  });

  it('I should see the empty register form', () => {
    changePasswordPage.oldPasswordField.should('be.visible');
    changePasswordPage.oldPasswordField.should('have.value', '');
    changePasswordPage.passwordField.should('be.visible');
    changePasswordPage.passwordField.should('have.value', '');
    changePasswordPage.confirmPasswordField.should('be.visible');
    changePasswordPage.confirmPasswordField.should('have.value', '');
  });

  it('I should see a register button', () => {
    changePasswordPage.submitButton.should('be.visible');
    changePasswordPage.submitButton.shouldHaveText('Change Password');
  });

  it('I should see home link', () => {
    changePasswordPage.homeLink.should('be.visible');
    changePasswordPage.homeLink.shouldHaveLink('/');
  });
});

describe('When I visit change password page without logging in', () => {
  before(() => {
    cy.visit('account/change-password');
  });

  it('I should be see login page', () => {
    loginPage.page.should('exist');
  });
});

describe('When I try to change password without new password', () => {
  before(() => {
    logIn();
    cy.visit('account/change-password');
    changePasswordPage.passwordField.type('sometext');
    changePasswordPage.confirmPasswordField.type('sometext');
    changePasswordPage.submitButton.click();
  });

  it('I should still be on change password page', () => {
    changePasswordPage.page.should('exist');
  });

  it('I should see old password validation error', () => {
    changePasswordPage.oldPasswordValidation.should('be.visible');
    changePasswordPage.oldPasswordValidation.shouldHaveText('Old Password is required');
  });

  it('I should not see confirm password validation error', () => {
    changePasswordPage.confirmPasswordValidation.should('not.exist');
  });
});

describe('When I try to change password without password', () => {
  before(() => {
    logIn();
    cy.visit('account/change-password');
    changePasswordPage.submitButton.click();
  });

  it('I should still be on change password page', () => {
    changePasswordPage.page.should('exist');
  });

  it('I should see password validation error', () => {
    changePasswordPage.passwordValidation.should('be.visible');
    changePasswordPage.passwordValidation.shouldHaveText('Password is required');
  });

  it('I should see confirm password validation error', () => {
    changePasswordPage.confirmPasswordValidation.should('be.visible');
    changePasswordPage.confirmPasswordValidation.shouldHaveText('Confirm Password is required');
  });
});

describe('When I try to change password with different password and confirm password', () => {
  before(() => {
    logIn();
    cy.visit('account/change-password');
    changePasswordPage.oldPasswordField.type('someoldtext');
    changePasswordPage.passwordField.type('sometext');
    changePasswordPage.confirmPasswordField.type('some other text');
    changePasswordPage.submitButton.click();
  });

  it('I should still be on change password page', () => {
    changePasswordPage.page.should('exist');
  });

  it('I should see validation error', () => {
    changePasswordPage.confirmPasswordValidation.should('be.visible');
    changePasswordPage.confirmPasswordValidation.shouldHaveText('Passwords must match');
  });
});

describe('When I try to change password and there is error', () => {
  before(() => {
    logIn();
    authenticationMock.mockChangePasswordResetFailure();
    cy.visit('account/change-password');
    changePasswordPage.oldPasswordField.type('sometext');
    changePasswordPage.passwordField.type('sometext');
    changePasswordPage.confirmPasswordField.type('sometext');
    changePasswordPage.submitButton.click();
  });

  it('I should still be on change password page', () => {
    changePasswordPage.page.should('exist');
  });

  it('I should see error', () => {
    notifications.errorMessage.shouldHaveText('Unable to change password. Please try again.');
  });
});

describe('When I change password successfully', () => {
  before(() => {
    logIn();
    authenticationMock.mockChangePasswordReset();
    cy.visit('account/change-password');
    changePasswordPage.oldPasswordField.type('sometext');
    changePasswordPage.passwordField.type('sometext');
    changePasswordPage.confirmPasswordField.type('sometext');
    changePasswordPage.submitButton.click();
  });

  it('I should be redirected out of change password', () => {
    cy.url().should('not.eq', 'account/change-password');
  });

  it('I should see success message', () => {
    notifications.successMessage.shouldHaveText('Password updated successfully');
  });
});
