import { createIntlCache, createIntl } from 'react-intl';
import enMessages from '../i18n/en.json';
import urMessages from '../i18n/ur.json';

class LocaleService
{
	initLocale ()
	{
		let locale = this.getCurrentLanguage();

		if (!locale)
		{
			locale = 'ur';
			this.setCurrentLanguage(locale);
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
		const intl = createIntl(
			{
			// Locale of the application
				locale,
				// Locale of the fallback defaultMessage
				defaultLocale : 'en',
				messages
			},
			cache
		);
		//const { intl } = createIntl new IntlProvider({ locale, messages }, {}).getChildContext();
		this.intl = intl;

		document.dir = isRtl ? 'rtl' : 'ltr';

		return {
			locale,
			messages,
			isRtl
		};
	}

	getCurrentLanguage ()
	{
		return window.localStorage.getItem('language');
	}

	setCurrentLanguage (language)
	{
		window.localStorage.setItem('language', language);
	}

	formatMessage (id)
	{
		return this.intl.formatMessage({ id });
	}

	isRtl ()
	{
		let locale = this.getCurrentLanguage();

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
	}
}

export default new LocaleService();
