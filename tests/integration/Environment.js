import '../../src/index.scss';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import { unmountComponentAtNode }  from 'react-dom';
import { setCookie, removeCookie } from 'crumble';
import * as clock                  from './mocks/clock';
import * as server                 from './mocks/server';
import * as tracker                from './mocks/tracker';
import * as navigation             from './mocks/navigation';
import { start }                   from '../../src/index.jsx';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Environment
{
	static async start (url = '/', {
		configuration,
		isInApp = false,
		isLoggedIn = true
	} = {})
	{
		// Create root element.
		const root = document.createElement('div');
		root.id = 'root';
		document.body.appendChild(root);

		// Navigate.
		await this.navigate(url);

		// Native.
		if (isInApp)
		{
			document.cookie = setCookie({
				name  : 'je-is-native-partnercentre',
				path  : '/',
				value : 'true'
			});
		}

		// Login.
		if (isLoggedIn)
		{
			await this.login();
		}

		// Start.
		await start(
			Object.assign({
				enabled                    : true,
				tenant                     : 'uk',
				locale                     : 'en-GB',
				clientId                   : 'Segmentation',
				urlToBenefitsPost          : 'https://blog.just-eat.co.uk/local-legend-benefits',
				urlToFoodHygieneHub        : 'https://partnerblog.just-eat.co.uk/category/food-hygiene-hub',
				urlToGetInTouch			   : 'https://partner.just-eat.co.uk/Help/Message',
				urlToReporting             : 'https://insights.just-eat.co.uk',
				urlToSegmentationApi       : '',
				urlToConnect               : 'https://connect.just-eat.co.uk',
				urlToHygieneRatingProvider : 'https://www.food.gov.uk',
				urlToLoggingService        : 'https://logging.just-eat.co.uk',
				requirements               : {
					orders        : { maximum : 50,  required : 20 },
					experience    : { maximum : 50,  required : 40 },
					notifications : { maximum : 100, required : 70 }
				}
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

		// Clean up cookies.
		document.cookie = removeCookie({
			name : 'je-is-native-partnercentre',
			path : '/'
		});
	}

	static async navigate (url)
	{
		history.pushState({}, '', url);
	}

	static async login ()
	{
		const expires = new Date(
			Date.now() + (1200 * 60 * 1000)
		).toISOString();

		localStorage.setItem('je.segmentation.token', JSON.stringify({
			expires, tokenType : 'bearer', accessToken : '0123456789'
		}));
	}

	static async getFixture (pathToFixture)
	{
		return (
			await import(`./fixtures/${pathToFixture}`)
		).default;
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export { clock, server, tracker, navigation };
