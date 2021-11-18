import { homePage, loginPage } from '../../page-objects';
import { logIn } from '../../helpers';
import { authenticationMock } from '../../mock';

describe('When user is signed in as administrator on mobile phone', {
  viewportHeight: 667,
  viewportWidth: 375,
}, () => {
  before(() => {
    logIn();
    cy.visit('/');

    cy.get('[data-ft="page-loading"]').should('not.exist', { timeout: 60000 });
  });

  it('I should see home page', () => {
    homePage.page.should('be.visible');
  });

  it('I should see the logo', () => {
    homePage.header.logo.should('be.visible');
  });

  it('I should not see the Application title', () => {
    homePage.header.title.should('not.be.visible');
  });

  it('I should see the language menu', () => {
    homePage.header.languageMenu.should('be.visible');
  });

  it('I should see the dark mode toggle', () => {
    homePage.header.darkModeToggle.should('be.visible');
  });

  describe('and I click on language menu', () => {
    before(() => {
      homePage.header.languageMenu.click();
    });

    after(() => {
      homePage.header.languageDropDown.enLanguage.click();
    });

    it('I should see language list', () => {
      homePage.header.languageDropDown.enLanguage.should('be.visible');
      homePage.header.languageDropDown.urLanguage.should('be.visible');
      homePage.header.languageDropDown.hiLanguage.should('be.visible');
      homePage.header.languageDropDown.pnLanguage.should('be.visible');
    });
  });

  describe('and I switch to dark mode', () => {
    before(() => {
      homePage.header.darkModeToggle.click();
    });

    it('I should see dark mode', () => {
      cy.get('body').should('have.css', 'background-color', 'rgb(18, 18, 18)');
    });

    describe('and I switch to back to bright mode', () => {
      before(() => {
        homePage.header.darkModeToggle.click();
      });

      it('I should see dark mode', () => {
        cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)');
      });
    });
  });

  it('I should see the mobile menu', () => {
    homePage.header.mobileMenu.should('be.visible');
  });

  describe('And I open mobile menu', () => {
    before(() => {
      homePage.header.mobileMenu.click();
    });

    it('I should see mobile side bar', () => {
      homePage.header.mobileSideBar.should('be.visible');
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

    it('I should see profile link', () => {
      homePage.header.profileLink.should('be.visible');
      homePage.header.profileLink.shouldHaveLink('/profile');
    });

    it('I should see change password link', () => {
      homePage.header.changePasswordLink.should('be.visible');
      homePage.header.changePasswordLink.shouldHaveLink('/account/change-password');
    });

    it('I should not see admin link', () => {
      homePage.header.adminLink.should('not.exist');
    });

    it('I should see logout link', () => {
      homePage.header.logoutLink.should('be.visible');
    });

    describe('and I click on logout link', () => {
      before(() => {
        authenticationMock.mockRevokeToken();
        homePage.header.logoutLink.click();
      });

      it('I should be navigated to login page', () => {
        loginPage.page.should('be.visible');
      });
    });
  });

  describe('and I switch to urdu', () => {
    before(() => {
      logIn();
      cy.visit('/');
      homePage.header.languageMenu.click();
      homePage.header.languageDropDown.urLanguage.click();
    });

    it('I should see page in right-to-left', () => {
      cy.get('body').should('have.attr', 'dir', 'rtl');
    });
  });
});
