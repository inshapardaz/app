export default {
  get page() {
    return cy.get('[data-ft="home-page"]');
  },

  header: {
    get logo() {
      return cy.get('[data-ft="logo"]');
    },

    get title() {
      return cy.get('[data-ft="app-name"]');
    },

    get booksLink() {
      return cy.get('[data-ft="books-link"]').filter(':visible');
    },

    get authorsLink() {
      return cy.get('[data-ft="authors-link"]').filter(':visible');
    },

    get seriesLink() {
      return cy.get('[data-ft="series-link"]').filter(':visible');
    },

    get categoriesMenu() {
      return cy.get('[data-ft="categories-menu"]').filter(':visible');
    },

    get languageMenu() {
      return cy.get('[data-ft="language-menu"]').filter(':visible');
    },

    languageDropDown: {
      get enLanguage() {
        return cy.get('[data-ft="language-en"]').filter(':visible');
      },
      get urLanguage() {
        return cy.get('[data-ft="language-ur"]').filter(':visible');
      },
      get hiLanguage() {
        return cy.get('[data-ft="language-hi"]').filter(':visible');
      },
      get pnLanguage() {
        return cy.get('[data-ft="language-pn"]').filter(':visible');
      },
    },

    get darkModeToggle() {
      return cy.get('[data-ft="dark-mode-toggle"]').filter(':visible');
    },

    get mobileMenu() {
      return cy.get('[data-ft="mobile-menu"]').filter(':visible');
    },

    get mobileSideBar() {
      return cy.get('[data-ft="mobile-side-bar"]').filter(':visible');
    },

    get profileMenu() {
      return cy.get('[data-ft="profile-menu"]').filter(':visible');
    },

    get profileLink() {
      return cy.get('[data-ft="profile-link"]').filter(':visible');
    },

    get changePasswordLink() {
      return cy.get('[data-ft="change-password-link"]').filter(':visible');
    },

    get adminLink() {
      return cy.get('[data-ft="admin-link"]');
    },

    get logoutLink() {
      return cy.get('[data-ft="logout-link"]').filter(':visible');
    },
  },

  footer: {
    get copyrights() {
      return cy.get('[data-ft="copyrights"]');
    },
  },
};
