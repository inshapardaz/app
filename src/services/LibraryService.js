import axios from 'axios';
import AuthService from './AuthService';

const Config = require('Config');

function LibraryService ()
{
	const libraryId = Config.libraryId;
	const libraryUrl = `${Config.apiUrl}/library/${libraryId}`;
	this.appendAuthentication = async (headers) =>
	{
		if (AuthService.isAuthenticated())
		{
			let authorization = `Bearer ${AuthService.getAccessToken()}`;
			headers['Authorization'] = authorization;
		}
	};

	this.get = async (url) =>
	{
		let headers = {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		};

		this.appendAuthentication(headers);

		let options = {
			url,
			method : 'get',
			withCredentials : true,
			headers
		};

		const res = await axios(options);
		return this.parseObject(res.data);
	};

	this.post = async (url, contents, contentType = 'application/json') =>
	{
		let headers = {
			'Accept' : 'application/json',
			'Content-Type' : contentType
		};

		this.appendAuthentication(headers);

		let options = {
			withCredentials : true,
			headers
		};

		delete contents.links;

		const res = await axios.post(url, contents, options);
		return this.parseObject(res.data);
	};

	this.put = async (url, contents) =>
	{
		let headers = {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		};

		this.appendAuthentication(headers);

		delete contents.links;

		let options = {
			url,
			method : 'put',
			withCredentials : true,
			headers,
			data : contents
		};

		const res = await axios(options);
		return this.parseObject(res.data);
	};

	this.delete = async (url) =>
	{
		let headers = {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		};

		this.appendAuthentication(headers);

		let options = {
			url,
			method : 'delete',
			withCredentials : true,
			headers
		};

		const res = await axios(options);
		return this.parseObject(res.data);
	};

	this.upload = async (url, file) =>
	{
		let headers = {
			'Accept' : 'application/json'
		};

		await this.appendAuthentication(headers);

		let options = {
			withCredentials : true,
			headers
		};

		const formData = new FormData();
		formData.append('file', file, file.fileName);

		const res = await axios.put(url, formData, options);
		return this.parseObject(res.data);
	};

	this.getEntry = async () =>
	{
		return this.get(`${libraryUrl}`);
	};

	this.getCategories = async () =>
	{
		return this.get(`${libraryUrl}/categories`);
	};

	this.getCategory = async (id) =>
	{
		return this.get(`${libraryUrl}/categories/${id}`);
	};

	this.getSeries = async (query = null, pageNumber = 1, pageSize = 12) =>
	{
		return this.get(`${libraryUrl}/series?pageNumber=${pageNumber}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getSeriesById = async (id) =>
	{
		return this.get(`${libraryUrl}/series/${id}`);
	};

	this.searchBooks = async (query, page = 1, pageSize = 12) =>
	{
		return this.get(`${libraryUrl}/books?query=${query}&pageNumber=${page}&pageSize=${pageSize}`);
	};

	this.getLatestBooks = async () =>
	{
		const url = `${libraryUrl}/books?pageNumber=1&pageSize=12&sortby=DateCreated`;
		return this.get(url);
	};

	// eslint-disable-next-line max-params
	this.getBooks = async (authorId = null, categoryId = null, seriesId = null,
		query = null, page = 1, pageSize = 12) =>
	{
		let queryVal = this.getQueryParameter(query);
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
			return this.get(`${libraryUrl}/books?pageNumber=${page}&pageSize=${pageSize}${queryVal}`);
		}

		return this.get(`${libraryUrl}/books?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBooksByCategory = async (category, page = 1, pageSize = 12, query = null) =>
	{
		const url = `${libraryUrl}/categories/${category}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBooksBySeries = async (series, page = 1, pageSize = 12, query = null) =>
	{
		const url = `${libraryUrl}/series/${series}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBook = async (id) =>
	{
		return this.get(`${libraryUrl}/books/${id}`);
	};

	this.getBookChapters = async (book) =>
	{
		return this.get(book.links.chapters);
	};

	this.getChapters = async (bookId) =>
	{
		return this.get(`${libraryUrl}/books/${bookId}/chapters`);
	};

	this.getChapter = async (id, chapterId) =>
	{
		return this.get(`${libraryUrl}/books/${id}/chapters/${chapterId}`);
	};

	this.getChapterContents = async (id, chapterId) =>
	{
		return this.get(`${libraryUrl}/books/${id}/chapters/${chapterId}/contents`);
	};

	this.getAuthors = async (query = null, page = 1, pageSize = 12) =>
	{
		return this.get(`${libraryUrl}/authors?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.searchAuthors = async (query, page = 1, pageSize = 6) =>
	{
		return this.get(`${libraryUrl}/authors?&pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getAuthor = async (id) =>
	{
		return this.get(`${libraryUrl}/authors/${id}`);
	};

	this.getAuthorBooks = async (authorId, query = null, page = 1, pageSize = 12) =>
	{
    	return this.get(`${libraryUrl}/books?pageNumber=${page}&pageSize=${pageSize}&authorid=${authorId}`);
	};

	this.getBookFiles = async (link) =>
	{
		return this.get(link);
	};

	this.getDictionary = async (id) =>
	{
		return this.get(`${libraryUrl}/dictionaries/${id}`);
	};

	this.getWords = async (dictionaryId, page = 1) =>
	{
		return this.get(`${libraryUrl}/dictionaries/${dictionaryId}/words?pageNumber=${page}&pageSize=12`);
	};

	this.getWordMeaning = async (dictionaryId, wordId) =>
	{
		return this.get(`${libraryUrl}/dictionaries/${dictionaryId}/words/${wordId}/meanings`);
	};

	this.getWordTranslations = async (dictionaryId, wordId) =>
	{
		return this.get(`${libraryUrl}/dictionaries/${dictionaryId}/words/${wordId}/translations`);
	};

	this.getWordRelationships = async (dictionaryId, wordId) =>
	{
		return this.get(`${libraryUrl}/dictionaries/${dictionaryId}/words/${wordId}/relationships`);
	};

	this.getQueryParameter  = query =>
	{
		return (query ? `&query=${query}` : '');
	};

	this.parseObject = (source) =>
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
				source.data.forEach(item => newItems.push(this.parseObject(item)));
				source.data = newItems;
			}

			if (source.files)
			{
				let newItems = [];
				source.files.forEach(item => newItems.push(this.parseObject(item)));
				source.files = newItems;
			}

			if (Array.isArray(source))
			{
				let newItems = [];
				source.forEach(item => newItems.push(this.parseObject(item)));
				return newItems;
			}
		}

		return source;
	};
}

export default new LibraryService();
