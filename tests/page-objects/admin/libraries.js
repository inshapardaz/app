class libraryRow {
  constructor(element) {
    this.element = element;
  }

  get name() {
    return this.element.find('[data-ft="library-name"]');
  }

  get ownerEmail() {
    return this.element.find('[data-ft="library-owner-email"]');
  }

  get language() {
    return this.element.find('[data-ft="library-language"]');
  }

  get supportsPeriodicals() {
    return this.element.find('[data-ft="library-supports-periodical"]');
  }

  get editButton() {
    return this.element.find('[data-ft="library-edit"]');
  }

  get deleteButton() {
    return this.element.find('[data-ft="library-delete"]');
  }
}
export default {
  get page() {
    return cy.get('[data-ft="admin-libraries-page"]');
  },

  get addButton() {
    return cy.get('[data-ft="create-library-button"]');
  },

  list: {
    get table() {
      return cy.get('[data-ft="libraries-list"]');
    },

    get rows() {
      const elements = this.table.find('[data-ft="libraries-list-row"]');
      return elements.each((e) => new libraryRow(e));
    },
  },
};
