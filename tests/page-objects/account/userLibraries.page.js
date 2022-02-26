class LibraryCell {
  constructor(element) {
    this.element = element;
  }

  get name() {
    return this.element.find('[data-ft="library-name"]');
  }

  get language() {
    return this.element.find('[data-ft="library-language"]');
  }

  get selectButton() {
    return this.element.find('[data-ft="library-select"]');
  }
}

export default {
  get page() {
    return cy.get('[data-ft="user-libraries-page"]');
  },

  get libraries() {
    const cells = [];
    cy.get('[data-ft="user-libraries-page"]')
      .find('[data-ft="libraries-cell"]')
      .each(($el) => {
        cells.push(new LibraryCell($el));
      });
    return cells;
  },
};
