import '../../src/index.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import { unmountComponentAtNode }  from 'react-dom';
import * as clock                  from './mocks/clock';
import * as server                 from './mocks/server';
import * as navigation             from './mocks/navigation';
import { start }                   from '../../src/index.jsx';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Environment
{
	static async start (url = '/', {
		configuration
	} = {})
	{
		// Create root element.
		const root = document.createElement('div');
		root.id = 'root';
		document.body.appendChild(root);

		// Navigate.
		await this.navigate(url);

		// Start.
		await start(
			Object.assign({
				clientId                   : 'inshapardaz-web',
				authority                  : 'http://inshapardaz.eu.auth0.com',
				audience                   : 'http://api.inshapardaz.org',
				apiUrl                     : 'http://localhost:4200/api'
			}, configuration)
		);
	}

	static async stop ()
	{
		const root = document.querySelector('#root');

		// Unmount.
		unmountComponentAtNode(root);

		// Destroy.
		root.remove();

		// Clean up sessions storage.
		sessionStorage.clear();

		// Clean up local storage.
		localStorage.clear();
	}

	static async navigate (url)
	{
		history.pushState({}, '', url);
	}

	static async getFixture (pathToFixture)
	{
		return (
			await import(`./fixtures/${pathToFixture}`)
		).default;
	}
}

export { clock, server, navigation };
