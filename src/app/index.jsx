import React, { Fragment, useState, useEffect } from 'react';
import { createMuiTheme, StylesProvider, ThemeProvider, jssPreset } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { accountService, localeService, libraryService } from '../services';
import Loading from '../components/Loading.jsx';
import Routes from '../components/routes';
import { SnackbarProvider } from 'notistack';

function App() {
	const [, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchEntry = () => {
			setIsLoading(true);

			libraryService.getEntry()
				.then(() => setIsLoading(false), e => {
					console.error('error', e);
					setIsLoading(false);
				});
		};

		fetchEntry();

		const subscription = accountService.user.subscribe(x => setUser(x));
		return subscription.unsubscribe;
	}, []);

	const { messages, locale } = localeService.initLocale();

	const isRtl = localeService.isRtl();

	const direction = isRtl ? 'rtl' : 'ltr';

	const theme = createMuiTheme({
		direction,
		typography: {
			fontFamily: [
				'Dubai',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"'
			].join(',')
		},
		palette: {
			primary: {
				main: '#373837',
				light: '#848484'
			}
		}
	});

	document.body.dir = direction;

	const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

	if (isLoading) {
		return (<Loading />);
	}

	return (
		<IntlProvider locale={locale} messages={messages} textComponent={Fragment} onError={() => null}>
			<StylesProvider jss={jss}>
				<ThemeProvider theme={theme}>
					<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', preventDuplicate: true }}>
						<Routes />
					</SnackbarProvider>
				</ThemeProvider>
			</StylesProvider>
		</IntlProvider>
	);
}

export { App };
