import '@babel/polyfill';
import 'webcomponents.js/webcomponents-lite';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React, { Fragment }                                                from 'react';
import { IntlProvider, addLocaleData }                                    from 'react-intl';
import { Provider }                                                       from 'react-redux';
import { render }                                                         from 'react-dom';
import AuthenticationService                                              from './services/AuthenticationService';
import LibraryService                                                     from './services/LibraryService';
import { createStore }                                                    from './state';
import Page                                                               from './components/page/Page.jsx';
import triggerEvent                                                       from './utilities/triggerEvent';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

async function loadFormatDataForLocale (locale)
{
	let data;

	switch (locale)
	{
		case 'en-GB' :
		case 'en-IE' :
		case 'en-AU' :
		case 'en-NZ' :
			data = await import('react-intl/locale-data/en');
			break;

		case 'ur' :
		case 'ur-PK' :
			data = await import('react-intl/locale-data/ur');
			break;
	}

	return addLocaleData(data.default);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function start (config)
{
	let isEnabled = config.enabled;

	window.dataLayer = window.dataLayer || [];

	if (isEnabled)
	{
		const authenticationService = new AuthenticationService(config);
		const libraryService   = new LibraryService(authenticationService, config);

		// Create store.
		const store = await createStore(config, {
			authenticationService, libraryService
		});

		// Load locale.
		await loadFormatDataForLocale(config.locale);

		// Load translations.
		const messages = await import(`./i18n/${config.locale}`);

		// Render.
		render(
			<IntlProvider locale={ config.locale } messages={ messages } textComponent={ Fragment }>
				<Provider store={ store }>
					<Page />
				</Provider>
			</IntlProvider>,
			document.querySelector('#root')
		);
	}
	else
	{
		console.warn(`Being accessed on tenant ${config.tenant} where it is currently disabled.`);
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

triggerEvent(window, 'appreadytostart');
