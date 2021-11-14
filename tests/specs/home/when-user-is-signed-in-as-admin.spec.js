import { homePage, loginPage } from '../../page-objects';
import { loginAsAdmin } from '../../helpers';
import { authenticationMock } from '../../mock';

describe('When user is signed in as administrator', () => {
  before(() => {
    loginAsAdmin();
    cy.visit('/');

    cy.get('[data-ft="page-loading"]').should('not.exist', { timeout: 60000 });
  });

  it('I should see home page', () => {
    homePage.page.should('be.visible');
  });

  it('I should see the logo', () => {
    homePage.header.logo.should('be.visible');
  });

  it('I should see the Application title', () => {
    homePage.header.title.should('be.visible');
    homePage.header.title.shouldHaveText('Test');
  });

  it('I should see the books link', () => {
    homePage.header.booksLink.should('be.visible');
    homePage.header.booksLink.shouldHaveLink('/books');
  });

  it('I should see the authors link', () => {
    homePage.header.authorsLink.should('be.visible');
    homePage.header.authorsLink.shouldHaveLink('/authors');
  });

  it('I should see the series link', () => {
    homePage.header.seriesLink.should('be.visible');
    homePage.header.seriesLink.shouldHaveLink('/series');
  });

  it('I should see the categories menu', () => {
    homePage.header.categoriesMenu.should('be.visible');
  });

  it('I should see the language menu', () => {
    homePage.header.languageMenu.should('be.visible');
  });

  it('I should see the dark mode toggle', () => {
    homePage.header.darkModeToggle.should('be.visible');
  });

  it('I should see the profile menu', () => {
    homePage.header.profileMenu.should('be.visible');
  });

  describe('and I click on profile menu', () => {
    before(() => {
      homePage.header.profileMenu.click();
    });

    after(() => {
      homePage.header.profileMenu.click();
    });

    it('I should see profile link', () => {
      homePage.header.profileLink.should('be.visible');
      homePage.header.profileLink.shouldHaveLink('/profile');
    });

    it('I should see change password link', () => {
      homePage.header.changePasswordLink.should('be.visible');
      homePage.header.changePasswordLink.shouldHaveLink('/account/change-password');
    });

    it('I should see admin link', () => {
      homePage.header.adminLink.should('be.visible');
      homePage.header.adminLink.shouldHaveLink('/admin');
    });

    it('I should see logout link', () => {
      homePage.header.logoutLink.should('be.visible');
    });
  });

  describe('and I click on logout link', () => {
    before(() => {
      authenticationMock.mockRevokeToken();
      homePage.header.profileMenu.click();
      homePage.header.logoutLink.click();
    });

    it('I should be navigated to login page', () => {
      loginPage.page.should('be.visible');
    });
  });
});
