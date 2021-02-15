import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage, useIntl } from "react-intl";

import Box from '@material-ui/core/Box';

import AuthorsBanner from '../../components/authors/authorsBanner.jsx';
import AuthorsList from '../../components/authors/authorsList';


const AuthorsPage = () => {
	const location = useLocation();
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState(null);

	useEffect(() => {
		const values = queryString.parse(location.search);
		setPage([values.page]);
		setQuery(values.query);
	}, [location]);

	return (
		<>
			<AuthorsBanner title={<FormattedMessage id="header.authors" />}
				background="/images/author_background.jpg" />
			<Box>
				<AuthorsList page={page} query={query} />
			</Box>
		</>
	);
};

export default AuthorsPage;
