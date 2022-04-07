import config from 'config';
import fetchWrapper from './fetch-wrapper';

const parseObject = (source) => {
  if (source) {
    if (source.links) {
      const newLinks = {};
      source.links.forEach((link) => {
        newLinks[link.rel.replaceAll('-', '_')] = link.href;
      });
      source.links = newLinks;
    }

    if (source.data) {
      const newItems = [];
      source.data.forEach((item) => newItems.push(parseObject(item)));
      source.data = newItems;
    }

    if (source.files) {
      const newItems = [];
      source.files.forEach((item) => newItems.push(parseObject(item)));
      source.files = newItems;
    }

    if (source.contents) {
      const newItems = [];
      source.contents.forEach((item) => newItems.push(parseObject(item)));
      source.contents = newItems;
    }

    if (source.authors) {
      const newItems = [];
      source.authors.forEach((item) => newItems.push(parseObject(item)));
      source.authors = newItems;
    }

    if (Array.isArray(source)) {
      const newItems = [];
      source.forEach((item) => newItems.push(parseObject(item)));
      return newItems;
    }
  }

  return source;
};

const get = (url, language) => fetchWrapper.get(url, { Accept: 'application/json', 'Accept-Language': language, 'Content-Type': 'application/json' })
  .then((data) => parseObject(data));

const post = (url, contents, contentType = 'application/json', language = 'en') => {
  if (contents) {
    delete contents.links;
  }

  return fetchWrapper.post(url, contents, { Accept: 'application/json', 'Content-Type': contentType, 'Content-Language': language })
    .then((data) => parseObject(data));
};

const put = (url, contents, contentType = 'application/json', language = 'en') => {
  if (contents) {
    delete contents.links;
  }

  return fetchWrapper.put(url, contents, { Accept: 'application/json', 'Content-Type': contentType, 'Content-Language': language })
    .then((data) => parseObject(data));
};

// eslint-disable-next-line no-underscore-dangle
const _delete = (url) => fetchWrapper.delete(url)
  .then((data) => parseObject(data));

const getQueryParameter = (query) => (query ? `&query=${query}` : '');
export default {
  getPunctuations: (language) => get(`${config.apiUrl}/tools/${language}/spellchecker/punctuation`),
  getAutoFixList: (language) => get(`${config.apiUrl}/tools/${language}/spellchecker/autocorrect`),
  getCorrections: (language, profile, query = null, pageNumber = 1, pageSize = 10) => get(`${config.apiUrl}/tools/${language}/corrections/${profile}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`),
  getCorrection: (language, profile, id) => get(`${config.apiUrl}/tools/${language}/corrections/${profile}/${id}`),
  addCorrection: (correction) => post(`${config.apiUrl}/tools/${correction.language}/corrections/${correction.profile}`, correction),
  updateCorrection: (correction) => put(`${config.apiUrl}/tools/${correction.language}/corrections/${correction.profile}/${correction.id}`, correction),
  deleteCorrection: (correction) => _delete(`${config.apiUrl}/tools/${correction.language}/corrections/${correction.profile}/${correction.id}`),
};
