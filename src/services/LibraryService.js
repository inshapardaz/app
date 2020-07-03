import axios from 'axios';

function LibraryService (baseUrl, getIdTokenClaims)
{
	this.appendAuthentication = async (headers) =>
	{
		const token = await getIdTokenClaims();
		if (token)
		{
			// eslint-disable-next-line no-underscore-dangle
			headers['Authorization'] = `Bearer ${token.__raw}`;
		}
	};

	this.get = async (url) =>
	{
		let headers = {
			'Accept' : 'application/json',
			'Content-Type' : 'application/json'
		};

		await this.appendAuthentication(headers);

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

		await this.appendAuthentication(headers);

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

		await this.appendAuthentication(headers);

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

		await this.appendAuthentication(headers);

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

		const res = await axios.post(url, formData, options);
		return this.parseObject(res.data);
	};

	this.getEntry = async () =>
	{
		return this.get(`${baseUrl}/library/1`);
	};

	this.getCategories = async () =>
	{
		return this.get(`${baseUrl}/categories`);
	};

	this.getCategory = async (id) =>
	{
		return this.get(`${baseUrl}/categories/${id}`);
	};

	this.getSeries = async () =>
	{
		return this.get(`${baseUrl}/series`);
	};

	this.getSeriesById = async (id) =>
	{
		return this.get(`${baseUrl}/series/${id}`);
	};

	this.searchBooks = async (query, page = 1, pageSize = 12) =>
	{
		return this.get(`${baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=${pageSize}`);
	};

	this.getLatestBook = async () =>
	{
		const url = `${baseUrl}/books/latest`;
		return this.get(url);
	};

	this.getBooks = async (page = 1, pageSize = 12, query = null) =>
	{
		const url = `${baseUrl}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBooksByCategory = async (category, page = 1, pageSize = 12, query = null) =>
	{
		const url = `${baseUrl}/categories/${category}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBooksBySeries = async (series, page = 1, pageSize = 12, query = null) =>
	{
		const url = `${baseUrl}/series/${series}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBook = async (id) =>
	{
		return this.get(`${baseUrl}/books/${id}`);
	};

	this.getBookChapters = async (book) =>
	{
		return this.get(book.links.chapters);
	};

	this.getChapters = async (bookId) =>
	{
		return this.get(`${baseUrl}/books/${bookId}/chapters`);
	};

	this.getChapter = async (id, chapterId) =>
	{
		return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}`);
	};

	this.getChapterContents = async (id, chapterId) =>
	{
		return this.get(`${baseUrl}/books/${id}/chapters/${chapterId}/contents`);
	};

	this.getAuthors = async (page = 1) =>
	{
		return this.get(`${baseUrl}/authors?pageNumber=${page}&pageSize=12`);
	};

	this.searchAuthors = async (query, page = 1, pageSize = 6) =>
	{
		return this.get(`${baseUrl}/authors?&pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getAuthor = async (id) =>
	{
		return this.get(`${baseUrl}/authors/${id}`);
	};

	this.getAuthorBooks = async (link, page = 1, pageSize = 12, query = null) =>
	{
		return this.get(`${link}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	};

	this.getBookFiles = async (link) =>
	{
		return this.get(link);
	};

	this.getDictionary = async (id) =>
	{
		return this.get(`${baseUrl}/dictionaries/${id}`);
	};

	this.getWords = async (dictionaryId, page = 1) =>
	{
		return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words?pageNumber=${page}&pageSize=12`);
	};

	this.getWordMeaning = async (dictionaryId, wordId) =>
	{
		return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/meanings`);
	};

	this.getWordTranslations = async (dictionaryId, wordId) =>
	{
		return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/translations`);
	};

	this.getWordRelationships = async (dictionaryId, wordId) =>
	{
		return this.get(`${baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/relationships`);
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

			if (source.items)
			{
				let newItems = [];
				source.items.forEach(item => newItems.push(this.parseObject(item)));
				source.item = newItems;
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

export default LibraryService;
