import React, { Fragment } from 'react';
import { createMuiTheme, StylesProvider, ThemeProvider, jssPreset, makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { useAuth0 } from './react-auth0-spa';
import { createStore } from './state';
import LibraryService from './services/LibraryService';
import LocaleService from './services/LocaleService';
import Routes from './components/Routes';

const useStyles = makeStyles((theme) => ({
	backdrop : {
	  zIndex : theme.zIndex.drawer + 1,
	  color : '#fff'
	}
}));

function App (props)
{
	const { loading, getIdTokenClaims } = useAuth0();

	if (loading)
	{
		const classes = useStyles();

		return (
			<Backdrop className={classes.backdrop} open>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	}

	const libraryService = new LibraryService(props.apiUrl, getIdTokenClaims);
	const { messages, locale } = LocaleService.initLocale();
	const store = createStore({
		libraryService
	});

	const isRtl = LocaleService.isRtl();

	const direction = isRtl ? 'rtl' : 'ltr';

	const theme = createMuiTheme({
		direction,
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
				  main : '#373837',
				  light : '#848484'
				}
			  }
		  }
	  });

	document.body.dir = direction;

	const jss = create({ plugins : [...jssPreset().plugins, rtl()] });

	return (
		<IntlProvider locale={locale} messages={messages} textComponent={Fragment}>
			<StylesProvider jss={jss}>
				<ThemeProvider theme={theme}>
					<Provider store={store}>
						<Routes />
					</Provider>
				</ThemeProvider>
			</StylesProvider>
		</IntlProvider>
	);
}

export default App;
