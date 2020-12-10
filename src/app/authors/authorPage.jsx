import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { libraryService } from '../../services';
import AuthorsBanner from '../../components/authors/authorsBanner.jsx';

const AuthorPage = () => {
	const { id } = useParams();
	const [author, setAuthor] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		libraryService.getAuthor(id)
			.then(data => setAuthor(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [id]);

	if (isLoading) {
		return <Loading />;
	}
	if (isError) {
		return <ErrorMessage message={<FormattedMessage id="authors.messages.error.loading" />} />;
	}

	return (
		<>
			<AuthorsBanner title={author.name} background={author && author.links && author.links.image ? author.links.image : null} />
		</>
	);
};

export default AuthorPage;
