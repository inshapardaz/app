import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import BookPublishList from '../../components/books/bookPublishList.jsx';
import { Container, Toolbar, Typography } from '@material-ui/core';
import BookStatusSelect from '../../components/books/bookStatusSelect.jsx';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line max-params

const PublishingPage = () => {
	const location = useLocation();
	const history = useHistory();
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState('AvailableForTyping');

	useEffect(() => {
		const values = queryString.parse(location.search);
		setPage(values.page ? values.page : 1);
		setQuery(values.q)
		setStatus(values.status ? values.status : 'AvailableForTyping');
	}, [location]);

	const buildLinkToPage = (page, status, query = null, sortBy = null) => {

		let querystring = "";
		querystring += page ? `page=${page}&` : "";
		querystring += query ? `query=${query}&` : "";
		querystring += status ? `status=${status}&` : "";
		querystring += sortBy ? `sortBy=${sortBy}&` : "";

		if (querystring !== "") {
			querystring = `?${querystring}`.slice(0, -1);
		}
		return `${location.pathname}${querystring}`;
	};

	return (
		<Container>
			<Toolbar>
				<Typography>
					<FormattedMessage id="publishing.books.filter" />
				</Typography>
				<BookStatusSelect value={status} onStatusSelected={(s) => history.push(buildLinkToPage(page, s.key, query))} />
			</Toolbar>
			<BookPublishList query={query} status={status} page={page} />
		</Container>)
}

export default PublishingPage;
