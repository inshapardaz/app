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
