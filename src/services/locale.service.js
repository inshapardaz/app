/* eslint-disable class-methods-use-this */
import { createIntlCache, createIntl } from 'react-intl';
import moment from 'moment';

import enMessages from '@/i18n/en.json';
import urMessages from '@/i18n/ur.json';

let intl = {};

function getISOLocale(locale) {
  switch (locale.toLowerCase()) {
    case 'ur': return 'ur-PK';
    default: return 'en';
  }
}

class LocaleService {
  initLocale() {
    let locale = this.getCurrentLanguage();

    if (!locale) {
      locale = 'ur';
    }

    return this.setCurrentLanguage(locale);
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
  }

  setCurrentLanguage(locale) {
    window.localStorage.setItem('language', locale);
    moment.locale(getISOLocale(locale));
    const isRtl = this.isRtl();
    const messages = this.getMessages();
    const cache = createIntlCache();

    intl = createIntl(
      {
        locale,
        defaultLocale: 'en',
        defaultFormats: 'en',
        messages,
        onError: () => { },
      },
      cache,
    );

    return {
      language: locale,
      messages,
      isRtl,
    };
  }

  isRtl(language) {
    const locale = language != null ? language : this.getCurrentLanguage();
    return ['ur'].includes(locale.toLowerCase());
  }

  getMessages(language) {
    const locale = language != null ? language : this.getCurrentLanguage();
    switch (locale.toLowerCase()) {
      case 'ur':
        return urMessages;
      default:
        return enMessages;
    }
  }

  getSupportedFonts() {
    return [
      {
        key: 'AlviLahoriNastaleeq',
        displayName: intl.formatMessage({ id: 'font.AlviLahoriNastaleeq' }),
      },
      {
        key: 'FajerNooriNastalique',
        displayName: intl.formatMessage({ id: 'font.FajerNooriNastalique' }),
      },
      {
        key: 'NafeesWebNaskh',
        displayName: intl.formatMessage({ id: 'font.NafeesWebNaskh' }),
      },
      {
        key: 'NafeesNastaleeq',
        displayName: intl.formatMessage({ id: 'font.NafeesNastaleeq' }),
      },
      {
        key: 'MehrNastaleeq',
        displayName: intl.formatMessage({ id: 'font.MehrNastaleeq' }),
      },
      {
        key: 'AdobeArabic',
        displayName: intl.formatMessage({ id: 'font.AdobeArabic' }),
      },
      {
        key: 'Dubai',
        displayName: intl.formatMessage({ id: 'font.Dubai' }),
      },
      {
        key: 'Noto Naskh Arabic',
        displayName: intl.formatMessage({ id: 'font.NotoNaskhArabic' }),
      },

      {
        key: 'Noto Nastaliq Urdu',
        displayName: intl.formatMessage({ id: 'font.NotoNastaliqUrdu' }),
      },
      {
        key: 'Jameel Noori Nastaleeq',
        displayName: intl.formatMessage({ id: 'font.JameelNooriNastaleeq' }),
      },
      {
        key: 'JameelNooriNastaleeqKasheeda',
        displayName: intl.formatMessage({ id: 'font.JameelNooriNastaleeqKasheeda' }),
      },
    ];
  }

  getPreferredFont() {
    return ['Dubai', 'Noto Naskh Arabic', 'MehrNastaleeq'];
  }

  formatMessage(descriptor, values) {
    return intl.formatMessage(descriptor, values);
  }

  getLanguages() {
    return [{
      name: 'English',
      locale: 'en',
    }, {
      name: 'اردو',
      locale: 'ur',
    }, {
      name: 'हिंदी',
      locale: 'hi',
    }, {
      name: 'پنجابی',
      locale: 'pn',
    }];
  }
}

export default new LocaleService();
