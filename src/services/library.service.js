import config from 'config';
import fetchWrapper from './fetch-wrapper';

const librariesUrl = () => `${config.apiUrl}/libraries`;

const libraryUrl = (l) => `${librariesUrl()}/${l.id}`;

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

const getQueryParameter = (query) => (query ? `&query=${query}` : '');

const get = (url, language = 'en') => fetchWrapper.get(url, { Accept: 'application/json', 'Accept-Language': language, 'Content-Type': 'application/json' })
  .then((data) => parseObject(data));

const download = (url) => fetchWrapper.downloadFile(url);

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

const _delete = (url) => fetchWrapper.delete(url)
  .then((data) => parseObject(data));

const upload = (url, file) => {
  const formData = new FormData();
  formData.append('file', file, file.fileName);

  return fetchWrapper.putFile(url, formData, { Accept: 'application/json' })
    .then((data) => parseObject(data));
};

const postFile = (url, file) => {
  const formData = new FormData();
  formData.append('file', file, file.fileName);

  return fetchWrapper.postFile(url, formData, { Accept: 'application/json' })
    .then((data) => parseObject(data));
};

const postMultipleFile = (url, files) => {
  const formData = new FormData();

  files.map((file) => formData.append('file', file, file.fileName));

  return fetchWrapper.postFile(url, formData, { Accept: 'application/json' })
    .then((data) => parseObject(data));
};

export default {
  getLibraries: (query = null, page = 1, pageSize = 12) => get(`${librariesUrl()}?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),

  getLibrary: (id) => get(`${librariesUrl()}/${id}`),

  createLibrary: (url, library) => post(url, library),

  updateLibrary: (url, library) => put(url, library),

  deleteLibrary: (library) => _delete(library.links.delete),

  getLibraryUsers: (library, query = null, page = 1, pageSize = 12) => get(`${library.links.users}?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),

  /* Users */

  getUser: (libraryId, userId) => get(`${librariesUrl()}/${libraryId}/users/${userId}`),

  addUser: (url, user) => post(url, user),

  updateUser: (url, user) => put(url, user),

  deleteUser: (user) => _delete(user.links.delete),

  /* Category */
  createCategory: (url, category) => post(url, category),

  updateCategory: (url, category) => put(url, category),

  getCategories: (url) => get(url),

  deleteCategory: (category) => _delete(category.links.delete),

  /* Series */
  createSeries: (url, series) => post(url, series),

  updateSeries: (url, series) => put(url, series),

  getSeries: (url, query = null, pageNumber = 1, pageSize = 12) => get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`),

  getSeriesById: (libraryId, seriesId) => get(`${librariesUrl()}/${libraryId}/series/${seriesId}`),

  deleteSeries: (series) => _delete(series.links.delete),

  /* Authors */
  createAuthor: (url, author) => post(url, author),

  updateAuthor: (url, author) => put(url, author),

  getAuthors: (url, query = null, pageNumber = 1, pageSize = 12) => get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`),

  getAuthorById: (libraryId, authorId) => get(`${librariesUrl()}/${libraryId}/authors/${authorId}`),

  deleteAuthor: (author) => _delete(author.links.delete),

  /* Books */

  getLatestBooks: (library) => get(`${libraryUrl(library)}/books?pageNumber=1&pageSize=12&sortby=DateCreated&sortDirection=descending`),

  createBook: (url, book) => post(url, book),

  updateBook: (url, book) => put(url, book),

  getBooks: (url,
    query = null,
    authorId = null,
    categoryId = null,
    seriesId = null,
    sortBy = null,
    sortDirection = null,
    favorite = null,
    read = null,
    status = null,
    pageNumber = 1,
    pageSize = 12) => {
    let queryVal = getQueryParameter(query);
    if (authorId) {
      queryVal += `&authorId=${authorId}`;
    }
    if (categoryId) {
      queryVal += `&categoryId=${categoryId}`;
    }
    if (seriesId) {
      queryVal += `&seriesId=${seriesId}`;
    }
    if (sortBy) {
      queryVal += `&sortBy=${sortBy}`;
    }
    if (favorite) {
      queryVal += '&favorite=true';
    }
    if (read !== undefined && read !== null) {
      queryVal += `&read=${read}`;
    }
    if (status) {
      queryVal += `&status=${status}`;
    }
    if (sortDirection) {
      queryVal += `&sortDirection=${sortDirection}`;
    }

    if (queryVal) {
      return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`);
    }

    return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`);
  },

  getBooksByAuthor: (url, pageNumber = 1,
    pageSize = 12) => {
    if (url.includes('?')) {
      return get(`${url}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  getBookById: (libraryId, bookId) => get(`${librariesUrl()}/${libraryId}/books/${bookId}`),

  deleteBook: (book) => _delete(book.links.delete),

  // Chapters
  getBookChapters: (url) => get(url),
  getChapterById: (libraryId, bookId, chapterNumber) => get(`${librariesUrl()}/${libraryId}/books/${bookId}/chapters/${chapterNumber}`),
  createChapter: (url, chapter) => post(url, chapter),
  updateChapter: (url, chapter) => put(url, chapter),
  deleteChapter: (chapter) => _delete(chapter.links.delete),
  getChapterContents: (libraryId, bookId, chapterNumber, language) => get(`${librariesUrl()}/${libraryId}/books/${bookId}/chapters/${chapterNumber}/contents?language=${language}`),
  addChapterContents: (url, language, newContent) => post(`${url}?language=${language}`, newContent),
  updateChapterContents: (url, language, newContent) => put(`${url}?language=${language}`, newContent),
  setChapterSequence: (chapters) => post(chapters.links.chapter_sequence, chapters.data.map((c) => ({ id: c.id, chapterNumber: c.chapterNumber }))),
  // Pages
  getBookPages: (url,
    status = 'Typing',
    assignmentFilter = 'assignedToMe',
    page = 1,
    pageSize = 12) => get(`${url}?pageNumber=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}${assignmentFilter ? `&assignmentFilter=${assignmentFilter}` : ''}`),

  getPageById: (libraryId, bookId, pageNumber) => get(`${librariesUrl()}/${libraryId}/books/${bookId}/pages/${pageNumber}`),
  createPage: (url, page) => post(url, page),
  updatePage: (url, page) => put(url, page),
  deletePage: (page) => _delete(page.links.delete),
  getMyPages: (url, status = 'Typing', page = 1, pageSize = 12) => get(`${url}?pageNumber=${page}&pageSize=${pageSize}${status ? `&status=${status}` : ''}`),

  // Periodicals

  getPeriodicals: (url,
    query = null,
    categoryId = null,
    sortBy = null,
    sortDirection = null,
    pageNumber = 1,
    pageSize = 12) => {
    let queryVal = getQueryParameter(query);

    if (categoryId) {
      queryVal += `&categoryId=${categoryId}`;
    }
    if (sortBy) {
      queryVal += `&sortBy=${sortBy}`;
    }
    if (sortDirection) {
      queryVal += `&sortDirection=${sortDirection}`;
    }

    if (queryVal) {
      return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`);
    }

    return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`);
  },

  createPeriodical: (url, periodical) => post(url, periodical),

  updatePeriodical: (url, periodical) => put(url, periodical),

  getPeriodicalById: (libraryId, periodicalId) => get(`${librariesUrl()}/${libraryId}/periodicals/${periodicalId}`),

  deletePeriodical: (periodical) => _delete(periodical.links.delete),

  getIssuesByPeriodicalsId: (libraryId,
    periodicalId,
    sortDirection = null,
    pageNumber = 1,
    pageSize = 12) => {
    let queryVal = '';

    if (sortDirection) {
      queryVal += `&sortDirection=${sortDirection}`;
    }

    const url = `${librariesUrl()}/${libraryId}/periodicals/${periodicalId}/issues`;
    return get(`${url}?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`);
  },

  createIssue: (url, issue) => post(url, issue),

  updateIssue: (url, issue) => put(url, issue),

  getIssueById: (libraryId, periodicalId, issueId) => get(`${librariesUrl()}/${libraryId}/periodicals/${periodicalId}/issues/${issueId}`),

  deleteIssue: (issue) => _delete(issue.links.delete),

  // Accounts
  getWriters: (libraryId, query) => get(`${librariesUrl()}/${libraryId}/writers${query ? `?query=${query}` : ''}`),

  upload,
  postMultipleFile: (url, files) => {
    const formData = new FormData();

    files.map((file) => formData.append('file', file, file.fileName));

    return fetchWrapper.postFile(url, formData, { Accept: 'application/json' })
      .then((data) => parseObject(data));
  },
  post,
  delete: _delete,
};
