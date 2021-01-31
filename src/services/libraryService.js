import { fetchWrapper} from '../helpers';
import config from 'config';

const getSelectedLibrary = () => JSON.parse(window.localStorage.getItem("selectedLibrary"));
const setSelectedLibrary = (selectedLibrary) => window.localStorage.setItem("selectedLibrary", JSON.stringify(selectedLibrary));
const getUserLibrariesFromCache = () => JSON.parse(window.sessionStorage.getItem("libraries"));
const setUserLibrariesCache = (libraries) => window.sessionStorage.setItem("libraries", JSON.stringify(libraries));

const librariesUrl = () =>  `${config.apiUrl}/libraries`;
const libraryUrl = () => `${librariesUrl()}/${getSelectedLibrary().id}`;

const _get = (url) => {
	return fetchWrapper.get(url, { 'Accept': 'application/json', 'Content-Type': 'application/json' })
		.then(data => _parseObject(data));
};

const _post = (url, contents, contentType = 'application/json') => {
	delete contents.links;

	return fetchWrapper.post(url, contents, { 'Accept': 'application/json', 'Content-Type': contentType })
		.then(data => _parseObject(data));
};

const _put = (url, contents, contentType = 'application/json') => {
	delete contents.links;

	return fetchWrapper.put(url, contents, { 'Accept': 'application/json', 'Content-Type': contentType })
		.then(data => _parseObject(data));
};

const _delete = (url) => {
	return fetchWrapper.delete(url)
		.then(data => _parseObject(data), e => console.error(e));
};

const _upload = (url, file) => {
		const formData = new FormData();
		formData.append('file', file, file.fileName);

		return fetchWrapper.putFile(url, formData, { 'Accept': 'application/json' })
			.then(data => _parseObject(data));
};

const _postFile = (url, file) => {
		const formData = new FormData();
		formData.append('file', file, file.fileName);

		return fetchWrapper.postFile(url, formData, { 'Accept': 'application/json' })
			.then(data => _parseObject(data));
};

const _postMultipleFile = (url, files) => {
	const formData = new FormData();

	files.map(file => formData.append('file', file, file.fileName));

	return fetchWrapper.postFile(url, formData, { 'Accept': 'application/json' })
		.then(data => _parseObject(data));
};
const _parseObject = (source) =>
{
	if (source)
	{
		if (source.links)
		{
			let newLinks = {};
			source.links.forEach(link =>
			{
				newLinks[link.rel.replace('-', '_')] = link.href;
			});
			source.links = newLinks;
		}

		if (source.data)
		{
			let newItems = [];
			source.data.forEach(item => newItems.push(_parseObject(item)));
			source.data = newItems;
		}

		if (source.files)
		{
			let newItems = [];
			source.files.forEach(item => newItems.push(_parseObject(item)));
			source.files = newItems;
		}

		if (Array.isArray(source))
		{
			let newItems = [];
			source.forEach(item => newItems.push(_parseObject(item)));
			return newItems;
		}
	}

	return source;
};


const getQueryParameter = (query) => (query ? `&query=${query}` : '');

export const libraryService =
{
	getSelectedLibrary,
	setSelectedLibrary,
	getUserLibrariesFromCache,
	setUserLibrariesCache,
	get: _get,
	post: _post,
	put: _put,
	delete: _delete,
	upload: _upload,
	postFile: _postFile,
	postMultipleFile: _postMultipleFile,
	getEntry: () => _get(`${libraryUrl()}`),
	getWriters: () => _get(`${libraryUrl()}/writers`),
	getCategories : () => _get(`${libraryUrl()}/categories`),
	getCategory : (id) => _get(`${libraryUrl()}/categories/${id}`),
	getSeries : (query = null, pageNumber = 1, pageSize = 12) =>
		_get(`${libraryUrl()}/series?pageNumber=${pageNumber}&pageSize=${pageSize}${getQueryParameter(query)}`),
	getSeriesById : (id) => _get(`${libraryUrl()}/series/${id}`),
	searchBooks : (query, page = 1, pageSize = 12) =>
		_get(`${libraryUrl()}/books?query=${query}&pageNumber=${page}&pageSize=${pageSize}`),
	getLatestBooks : () =>
		_get(`${libraryUrl()}/books?pageNumber=1&pageSize=12&sortby=DateCreated`),
	// eslint-disable-next-line max-params
	getBooks : (authorId = null, categoryId = null, seriesId = null,
		query = null, page = 1, pageSize = 12) =>
	{
		let queryVal = getQueryParameter(query);
		if (authorId)
		{
			queryVal += `&authorId=${authorId}`;
		}
		if (categoryId)
		{
			queryVal += `&categoryId=${categoryId}`;
		}
		if (seriesId)
		{
			queryVal += `&seriesId=${seriesId}`;
		}
		if (queryVal)
		{
			return _get(`${libraryUrl()}/books?pageNumber=${page}&pageSize=${pageSize}${queryVal}`);
		}

		return _get(`${libraryUrl()}/books?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`);
	},

	getLibraries: (query = null, page = 1, pageSize = 12) => {
		return _get(`${librariesUrl()}?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`);
	},
	getBooksByCategory : (category, page = 1, pageSize = 12, query = null) =>
		_get(`${libraryUrl()}/categories/${category}/books?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),
	getBooksBySeries : (series, page = 1, pageSize = 12, query = null) =>
		_get(`${libraryUrl()}/series/${series}/books?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),
	getBook : (id) => _get(`${libraryUrl()}/books/${id}`),
	getBookChapters : (book) => _get(book.links.chapters),
	getBookPages : (book, page = 1, pageSize = 12) => _get(`${book.links.pages}?pageNumber=${page}&pageSize=${pageSize}`),
	getChapters : (bookId) => _get(`${libraryUrl()}/books/${bookId}/chapters`),
	getChapter : (id, chapterId) => _get(`${libraryUrl()}/books/${id}/chapters/${chapterId}`),
	getChapterContents : (id, chapterId) => _get(`${libraryUrl()}/books/${id}/chapters/${chapterId}/contents`),
	getAuthors : (query = null, page = 1, pageSize = 12) =>
		_get(`${libraryUrl()}/authors?pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),
	searchAuthors : (query, page = 1, pageSize = 6) =>
		_get(`${libraryUrl()}/authors?&pageNumber=${page}&pageSize=${pageSize}${getQueryParameter(query)}`),
	getAuthor : (id) => _get(`${libraryUrl()}/authors/${id}`),
	getAuthorBooks : (authorId, query = null, page = 1, pageSize = 12) =>
		_get(`${libraryUrl()}/books?pageNumber=${page}&pageSize=${pageSize}&authorid=${authorId}`),
	getBookFiles : (link) => _get(link),
	getDictionary : (id) => _get(`${libraryUrl()}/dictionaries/${id}`),
	getWords : (dictionaryId, page = 1) => _get(`${libraryUrl()}/dictionaries/${dictionaryId}/words?pageNumber=${page}&pageSize=12`),
	getWordMeaning : (dictionaryId, wordId) => _get(`${libraryUrl()}/dictionaries/${dictionaryId}/words/${wordId}/meanings`),
	getWordTranslations : (dictionaryId, wordId) => _get(`${libraryUrl()}/dictionaries/${dictionaryId}/words/${wordId}/translations`),
	getWordRelationships : (dictionaryId, wordId) => _get(`${libraryUrl()}/dictionaries/${dictionaryId}/words/${wordId}/relationships`)
}
