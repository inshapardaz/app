import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { libraryService } from '../../services';
import AuthorsBanner from '../../components/authors/authorsBanner.jsx';
import BookList from '../../components/books/bookList';

const AuthorPage = () => {
	const location = useLocation();
	const { id } = useParams();
	const [author, setAuthor] = useState(null);
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		const values = queryString.parse(location.search);
		setPage(values.page);
		setQuery(values.q)

		libraryService.getAuthor(id)
			.then(data => setAuthor(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [location]);

	if (isLoading) {
		return <Loading />;
	}
	if (isError) {
		return <ErrorMessage message={<FormattedMessage id="authors.messages.error.loading" />} />;
	}

	return (
		<>
			<AuthorsBanner title={author.name} background={author && author.links && author.links.image ? author.links.image : null} />
			<BookList authorId={id} page={page} query={query} />
		</>
	);
};

export default AuthorPage;
