import { Error403Page } from '../../../page-objects';
import { logIn } from '../../../helpers';

describe('When I try create library page as normal user', () => {
  before(() => {
    logIn();

    cy.visit('/admin/libraries/create');
    cy.get('[data-ft="page-loading"]').should('not.be.visible', { timeout: 60000 });
  });

  it('I should see the unauthorized page', () => {
    Error403Page.page.should('exist');
  });
});
