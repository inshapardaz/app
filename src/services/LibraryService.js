import axios from 'axios';

export default class LibraryService
{
	constructor (authenticationService, { requirements, apiUrl })
	{
		this.baseUrl = apiUrl;
		this.requirements = requirements;
		this.authenticationService = authenticationService;
	}

	appendAuthentication (headers)
	{
		if (this.authenticationService.isAuthenticated)
		{
			const authorization = `Bearer ${this.authenticationService.getAccessToken()}`;
			headers['Authorization'] = authorization;
		}
	}

	async get (url)
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
	}

	async post (url, contents, contentType = 'application/json')
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
	}

	async put (url, contents)
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
	}

	async delete (url)
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
	}

	async upload (url, file)
	{
		let headers = {
			'Accept' : 'application/json'
		};

		this.appendAuthentication(headers);

		let options = {
			withCredentials : true,
			headers
		};

		const formData = new FormData();
		formData.append('file', file, file.fileName);

		const res = await axios.post(url, formData, options);
		return this.parseObject(res.data);
	}

	async getEntry ()
	{
		return this.get(`${this.baseUrl}/entry`);
	}

	async getCategories ()
	{
		return this.get(`${this.baseUrl}/categories`);
	}

	async getCategory (id)
	{
		return this.get(`${this.baseUrl}/categories/${id}`);
	}

	async getSeries ()
	{
		return this.get(`${this.baseUrl}/series`);
	}

	async getSeriesById (id)
	{
		return this.get(`${this.baseUrl}/series/${id}`);
	}

	async searchBooks (query, page = 1, pageSize = 12)
	{
		return this.get(`${this.baseUrl}/books?query=${query}&pageNumber=${page}&pageSize=${pageSize}`);
	}

	async getBooks (page = 1, pageSize = 12, query = null)
	{
		const url = `${this.baseUrl}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	}

	async getBooksByCategory (category, page = 1, pageSize = 12, query = null)
	{
		const url = `${this.baseUrl}/categories/${category}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	}

	async getBooksBySeries (series, page = 1, pageSize = 12, query = null)
	{
		const url = `${this.baseUrl}/series/${series}/books`;
		return this.get(`${url}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	}

	async getBook (id)
	{
		return this.get(`${this.baseUrl}/books/${id}`);
	}

	async getBookChapters (book)
	{
		return this.get(book.links.chapters);
	}

	async getChapters (bookId)
	{
		return this.get(`${this.baseUrl}/books/${bookId}/chapters`);
	}

	async getChapter (id, chapterId)
	{
		return this.get(`${this.baseUrl}/books/${id}/chapters/${chapterId}`);
	}

	async getChapterContents (id, chapterId)
	{
		return this.get(`${this.baseUrl}/books/${id}/chapters/${chapterId}/contents`);
	}

	async getAuthors (page = 1)
	{
		return this.get(`${this.baseUrl}/authors?pageNumber=${page}&pageSize=12`);
	}

	async searchAuthors (query, page = 1, pageSize = 6)
	{
		return this.get(`${this.baseUrl}/authors?&pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	}

	async getAuthor (id)
	{
		return this.get(`${this.baseUrl}/authors/${id}`);
	}

	async getAuthorBooks (link, page = 1, pageSize = 12, query = null)
	{
		return this.get(`${link}?pageNumber=${page}&pageSize=${pageSize}${this.getQueryParameter(query)}`);
	}

	async getBookFiles (link)
	{
		return this.get(link);
	}

	async getDictionary (id)
	{
		return this.get(`${this.baseUrl}/dictionaries/${id}`);
	}

	async getWords (dictionaryId, page = 1)
	{
		return this.get(`${this.baseUrl}/dictionaries/${dictionaryId}/words?pageNumber=${page}&pageSize=12`);
	}

	async getWordMeaning (dictionaryId, wordId)
	{
		return this.get(`${this.baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/meanings`);
	}

	async getWordTranslations (dictionaryId, wordId)
	{
		return this.get(`${this.baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/translations`);
	}

	async getWordRelationships (dictionaryId, wordId)
	{
		return this.get(`${this.baseUrl}/dictionaries/${dictionaryId}/words/${wordId}/relationships`);
	}

	getQueryParameter  = query =>
	{
		return (query ? `&query=${query}` : '');
	}

	parseObject (source)
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
	}
}
