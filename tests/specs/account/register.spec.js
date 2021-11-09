import { registerPage, loginPage, notifications } from '../../page-objects';
import { authenticationMock } from '../../mock';

describe('When I visit register page ', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    cy.visit('account/register?code=qweqrwrewr');
  });

  it('I should be see register page', () => {
    registerPage.page.should('exist');
  });

  it('I should see the empty register form', () => {
    registerPage.nameField.should('be.visible');
    registerPage.nameField.should('have.value', '');
    registerPage.passwordField.should('be.visible');
    registerPage.passwordField.should('have.value', '');
    registerPage.confirmPasswordField.should('be.visible');
    registerPage.confirmPasswordField.should('have.value', '');
    registerPage.acceptTermsCheckbox.control.should('be.visible');
    registerPage.acceptTermsCheckbox.checkbox.should('not.be.checked');
  });

  it('I should see a register button', () => {
    registerPage.registerButton.should('be.visible');
    registerPage.registerButton.shouldHaveText('Register');
  });

  it('I should see login link', () => {
    registerPage.loginLink.should('be.visible');
    registerPage.loginLink.shouldHaveLink('account/login');
  });

  it('I should see forget password link', () => {
    registerPage.forgetPasswordLink.should('be.visible');
    registerPage.forgetPasswordLink.shouldHaveLink('account/forgot-password');
  });
});

describe('When I visit register page without code', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    cy.visit('account/register');
  });

  it('I should be see login page', () => {
    loginPage.page.should('exist');
  });
});

describe('When I visit register page with invalid invitation link', () => {
  before(() => {
    authenticationMock.mockVerifyInviteFailure();
    cy.visit('account/register?code=53453244');
  });

  it('I should be see login page', () => {
    loginPage.page.should('exist');
  });

  it('I should show error', () => {
    notifications.errorMessage.shouldHaveText('Invitation link is not valid.');
  });
});

describe('When I visit register page with invalid link expired', () => {
  before(() => {
    authenticationMock.mockVerifyInviteExpired();
    cy.visit('account/register?code=4343432');
  });

  it('I should be see login page', () => {
    loginPage.page.should('exist');
  });

  it('I should show error', () => {
    notifications.errorMessage.shouldHaveText('Invitation link has expired. Please contact us to resend a new invitation code.');
  });
});

describe('When I try to register without providing name and password', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    cy.visit('account/register?code=qweqrwrewr');
    registerPage.acceptTermsCheckbox.check();
    registerPage.registerButton.click();
  });

  it('I should still be on register page', () => {
    registerPage.page.should('exist');
  });

  it('I should see name validation error', () => {
    registerPage.nameValidation.should('be.visible');
    registerPage.nameValidation.shouldHaveText('Name is required');
  });

  it('I should see password validation error', () => {
    registerPage.passwordValidation.should('be.visible');
    registerPage.passwordValidation.shouldHaveText('Password is required');
  });

  it('I should see confirm password validation error', () => {
    registerPage.confirmPasswordValidation.should('be.visible');
    registerPage.confirmPasswordValidation.shouldHaveText('Confirm Password is required');
  });
});

describe('When I try to register with different password and confirm password', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    cy.visit('account/register?code=qweqrwrewr');
    registerPage.nameField.type('sometexthere');
    registerPage.passwordField.type('sometext');
    registerPage.confirmPasswordField.type('some other text');
    registerPage.acceptTermsCheckbox.check();
    registerPage.registerButton.click();
  });

  it('I should still be on register page', () => {
    registerPage.page.should('exist');
  });

  it('I should see validation error', () => {
    registerPage.confirmPasswordValidation.should('be.visible');
    registerPage.confirmPasswordValidation.shouldHaveText('Passwords must match');
  });
});

describe('When I try to register without accepting terms and conditions', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    cy.visit('account/register?code=qweqrwrewr');
    registerPage.nameField.type('sometexthere');
    registerPage.passwordField.type('sometext');
    registerPage.confirmPasswordField.type('sometext');
    registerPage.registerButton.click();
  });

  it('I should still be on register page', () => {
    registerPage.page.should('exist');
  });
  it('I should see validation error', () => {
    registerPage.acceptTermsCheckboxValidation.should('be.visible');
    registerPage.acceptTermsCheckboxValidation.shouldHaveText('Accepting Terms & Conditions is required.');
  });
});

describe('When I try to register and there is error registering', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    authenticationMock.mockRegisterFailure();
    cy.visit('account/register?code=qweqrwrewr');
    registerPage.nameField.type('sometexthere');
    registerPage.passwordField.type('sometext');
    registerPage.confirmPasswordField.type('sometext');
    registerPage.acceptTermsCheckbox.check();
    registerPage.registerButton.click();
  });

  it('I should still be on register page', () => {
    registerPage.page.should('exist');
  });

  it('I should see error', () => {
    notifications.errorMessage.shouldHaveText('Unable to register. Please try again.');
  });
});

describe('When I register successfully', () => {
  before(() => {
    authenticationMock.mockVerifyInvite();
    authenticationMock.mockRegister();
    cy.visit('account/register?code=qweqrwrewr');
    registerPage.nameField.type('sometexthere');
    registerPage.passwordField.type('sometext');
    registerPage.confirmPasswordField.type('sometext');
    registerPage.acceptTermsCheckbox.check();
    registerPage.registerButton.click();
  });

  it('I should be on login page', () => {
    loginPage.page.should('exist');
  });

  it('I should see success message', () => {
    notifications.successMessage.shouldHaveText('Registration successful, please login with your credentials.');
  });
});
