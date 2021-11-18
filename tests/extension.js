Cypress.Commands.add(
  'shouldHaveText',
  { prevSubject: true },
  (subject, equalTo) => {
    expect(subject.text().trim()).to.eq(equalTo);
    return subject;
  },
);

Cypress.Commands.add(
  'shouldHaveLink',
  { prevSubject: true },
  (subject, equalTo) => {
    expect(subject).to.have.attr('href').contain(equalTo);
    return subject;
  },
);

Cypress.Commands.add('getLibraryCells', (subject) => {
  const listElement = subject.get()[0];
  const cellEl = listElement.querySelectorAll('[data-ft="libraries-cell"]');
  const cells = [...cellEl].map((c) => ({
    name: c.querySelectorAll('[data-ft="library-name"]'),
    language: c.querySelectorAll('[data-ft="library-language"]'),
  }));
  return cells;
});
