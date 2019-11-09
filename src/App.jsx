import React, { Fragment } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { useAuth0 } from './react-auth0-spa';

import { createStore } from './state';
import LibraryService from './services/LibraryService';
import LocaleService from './services/LocaleService';
import Routes from './components/Routes';

function App ()
{
	const { loading, getIdTokenClaims } = useAuth0();

	if (loading)
	{
		return (
			<div>Loading...</div>
		);
	}

	const libraryService = new LibraryService('http://localhost:5000/api', getIdTokenClaims);
	const { messages, locale } = LocaleService.initLocale();
	const store = createStore({
		libraryService
	});

	return (
		<IntlProvider locale={locale} messages={messages} textComponent={Fragment}>
			<Provider store={store}>
				<Routes />
			</Provider>
		</IntlProvider>
	);
}

export default App;
