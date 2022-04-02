import config from 'config';
import fetchWrapper from './fetch-wrapper';

const get = (url, language) => fetchWrapper.get(url, { Accept: 'application/json', 'Accept-Language': language, 'Content-Type': 'application/json' });

export default {
  getPunctuations: (language) => get(`${config.apiUrl}/tools/${language}/spellchecker/punctuation`),
  getAutoFixList: (language) => get(`${config.apiUrl}/tools/${language}/spellchecker/autoFix`),
  getCorrections: (language) => get(`${config.apiUrl}/tools/${language}/spellchecker/corrections`),
};
