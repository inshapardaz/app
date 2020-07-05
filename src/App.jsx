import React, { Fragment } from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { useAuth0 } from './react-auth0-spa';

import { createStore } from './state';
import LibraryService from './services/LibraryService';
import LocaleService from './services/LocaleService';
import Routes from './components/Routes';
import Loading from './Loading.jsx';

function App (props)
{
	const { loading, getIdTokenClaims } = useAuth0();

	if (loading)
	{
		return (
			<div>Loading...</div>
		);
	}

	const libraryService = new LibraryService(props.apiUrl, getIdTokenClaims);
	const { messages, locale } = LocaleService.initLocale();
	const store = createStore({
		libraryService
	});

	const theme = createMuiTheme({
		typography : {
			fontFamily : [
			  'Mehr-Nastaleeq',
			  'Roboto',
			  '"Helvetica Neue"',
			  'Arial',
			  'sans-serif',
			  '"Apple Color Emoji"',
			  '"Segoe UI Emoji"',
			  '"Segoe UI Symbol"'
			].join(','),
			palette : {
				primary : {
				  main : '#373837'
				},
				secondary : {
					main : '#848484'
				}
			  }
		  }
	  });

	return (
		<IntlProvider locale={locale} messages={messages} textComponent={Fragment}>
			<ThemeProvider theme={theme}>
				<Provider store={store}>
					<Loading>
						<Routes />
					</Loading>
				</Provider>
			</ThemeProvider>
		</IntlProvider>
	);
}

export default App;
