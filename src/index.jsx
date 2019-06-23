import '@babel/polyfill';
import 'webcomponents.js/webcomponents-lite';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React, { Fragment }                                                from 'react';
import { IntlProvider }                                                   from 'react-intl';
import { Provider }                                                       from 'react-redux';
import { render }                                                         from 'react-dom';
import Routes from './components/Routes';
import AuthenticationService                                              from './services/AuthenticationService';
import LibraryService                                                     from './services/LibraryService';
import { createStore }                                                    from './state';
import triggerEvent                                                       from './utilities/triggerEvent';
import LocaleService                                                      from './services/LocaleService';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function start (config)
{
	window.dataLayer = window.dataLayer || [];

	const authenticationService = new AuthenticationService(config);
	const libraryService   = new LibraryService(authenticationService, config);

	// Create store.
	const store = await createStore({
		authenticationService, libraryService
	});

	// Load translations.
	const { messages, locale } = await LocaleService.initLocale();

	// Render.
	render(
		<IntlProvider locale={ locale } messages={ messages } textComponent={ Fragment }>
			<Provider store={ store }>
				<Routes />
			</Provider>
		</IntlProvider>,
		document.querySelector('#root')
	);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

triggerEvent(window, 'appreadytostart');
