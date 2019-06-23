import { expect }                                   from 'chai';
import Environment, { server, navigation }          from '../Environment';
import Home                                         from '../page-objects/Home';
import Header                                       from '../page-objects/Header';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

describe('When I visit the home  page', function ()
{
	beforeEach(async function ()
	{
		navigation.disable();
	});

	afterEach(async function ()
	{
		server.reset();
		navigation.enable();

		await Environment.stop();
	});

	describe('and I am not logged in', function ()
	{
		beforeEach(async function ()
		{
			server.fakeJsonFeed('/api', {
				body : await Environment.getFixture('entry')
			});

			await Environment.start('/');
		});

		it('I should see header', async function ()
		{
			const header = await Home.header();

			expect(header.isDisplayed).to.be.true;
		});

		it('I should see logo', async function ()
		{
			const logo = await Header.logo();
			expect(logo.isDisplayed).to.be.true;
			expect(logo.location).to.be('/');
			expect(logo.image.isDisplayed).to.be.true;
		});
	});
});
