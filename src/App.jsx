import React, { Fragment, useEffect, useState } from 'react';
import { createMuiTheme, StylesProvider, ThemeProvider, jssPreset } from '@material-ui/core/styles';
import { IntlProvider } from 'react-intl';
import { create } from 'jss';
import rtl from 'jss-rtl';

import LocaleService from './services/LocaleService';
import Routes from './components/Routes';
import LibraryService from './services/LibraryService';
import AuthService from './services/AuthService';
import Loading from './components/Loading.jsx';

function App ()
{
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() =>
	{
		const fetchEntry = async () =>
		{
			setIsLoading(true);

			try
			{
				await LibraryService.getEntry();
			}
			catch (e)
			{
				console.error('error', e);
				//this.props.push('/error');
			}
			finally
			{
			  setIsLoading(false);
			}
		};

		const fetchData = async () =>
		{
			if (localStorage.getItem('isLoggedIn') === 'true')
			{
				AuthService.renewSession(() => fetchEntry());
			}
			fetchEntry();
		};

		fetchData();
	}, []);

	const { messages, locale } = LocaleService.initLocale();

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
			].join(',')
		},
		palette : {
			primary : {
				main : '#373837',
				light : '#848484'
			}
		}
	  });

	document.body.dir = direction;

	const jss = create({ plugins : [...jssPreset().plugins, rtl()] });

	if (isLoading)
	{
		return (<Loading />);
	}

	return (
		<IntlProvider locale={locale} messages={messages} textComponent={Fragment}>
			<StylesProvider jss={jss}>
				<ThemeProvider theme={theme}>
					<Routes />
				</ThemeProvider>
			</StylesProvider>
		</IntlProvider>
	);
}

export default App;
