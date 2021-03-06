import React, { Fragment, useState, useEffect } from 'react';
import { createMuiTheme, StylesProvider, ThemeProvider, jssPreset } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { Helmet } from 'react-helmet';
import { accountService, localeService, libraryService } from '../services';
import Loading from '../components/Loading.jsx';
import Routes from '../routes';
import { SnackbarProvider } from 'notistack';
import { ConfirmProvider } from 'material-ui-confirm';

function App() {
	const history = useHistory();
	const [, setUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [library, setLibrary] = useState(null);
	const { pathname } = useLocation();

	const goToLibrarySelect = () => {
		if (pathname !== '/admin') {
			history.push('/libraries/select');
		}
	}
	useEffect(() => {
		const fetchEntry = () => {
			setIsLoading(true);

			libraryService.getLibraries()
				.then((response) => {
					if (!response.data || response.data.length < 1) {
						goToLibrarySelect();
					}

					libraryService.setUserLibrariesCache(response.data);
					let selectedLibrary = libraryService.getSelectedLibrary();
					if (selectedLibrary === null) {
						goToLibrarySelect();
					}
					else {
						libraryService.get(selectedLibrary.links.self)
							.then(lib => {

								if (lib !== null) {
									libraryService.setSelectedLibrary(lib);
									setLibrary(lib);
								}
							}, e => {
								var firstLibrary = response.data[0];
								libraryService.setSelectedLibrary(firstLibrary);
								setLibrary(firstLibrary);
							});
					}

					setIsLoading(false);
				})
				.catch(e => {
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
				...localeService.getPreferredFont(),
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
				main: library != null && library.primaryColor != null ? library.primaryColor : '#373837',
				light: library != null && library.secondaryColor != null ? library.secondaryColor : '#848484'
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
					<ConfirmProvider>
						<Helmet titleTemplate={`${library != null ? library.name : 'Nawishta'} - %s`} />
						<SnackbarProvider maxSnack={3}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
							preventDuplicate={true}
							autoHideDuration={3000}>
							<Routes />
						</SnackbarProvider>
					</ConfirmProvider>
				</ThemeProvider>
			</StylesProvider>
		</IntlProvider>
	);
}

export { App };
