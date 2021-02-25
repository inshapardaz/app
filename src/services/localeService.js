import { createIntlCache, createIntl } from 'react-intl';
import enMessages from '../i18n/en.json';
import urMessages from '../i18n/ur.json';

let intl = {};

const getCurrentLanguage = () => window.localStorage.getItem('language');
const setCurrentLanguage = (language) => window.localStorage.setItem('language', language);

export const localeService =
{
	initLocale : () =>
	{
		let locale = getCurrentLanguage();

		if (!locale)
		{
			locale = 'ur';
			setCurrentLanguage(locale);
		}

		let isRtl = false;
		let messages = enMessages;
		switch (locale.toLowerCase())
		{
			case 'ur' :
				messages = urMessages;
				isRtl = true;
		}

		const cache = createIntlCache();

		// Create the `intl` object
		intl = createIntl(
			{
			// Locale of the application
				locale,
				// Locale of the fallback defaultMessage
				defaultLocale: 'en',
				defaultFormats: 'en',
				messages,
				onError: (e) => { }
			},
			cache
		);

		document.dir = isRtl ? 'rtl' : 'ltr';

		return {
			locale,
			messages,
			isRtl
		};
	},

	getCurrentLanguage,
	setCurrentLanguage,
	isRtl : () => {
		let locale = getCurrentLanguage();

		if (locale)
		{
			switch (locale.toLowerCase())
			{
				case 'ur' :
					return true;
				default :
					return false;
			}
		}
		return false;
	},
	getPreferredFont: () => {
		// always return array
		return ["Mehr-Nastaleeq"];
	}
}
