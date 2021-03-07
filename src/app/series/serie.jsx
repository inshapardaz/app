import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { libraryService } from '../../services';
import SerieBanner from '../../components/series/serieBanner.jsx';
import BookList from '../../components/books/bookList';

const SeriePage = () => {
	const location = useLocation();
	const { id } = useParams();
	const [serie, setSerie] = useState(null);
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		const values = queryString.parse(location.search);
		setPage(values.page);
		setQuery(values.q)

		libraryService.getSeriesById(id)
			.then(data => setSerie(data))
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
		return <ErrorMessage message={<FormattedMessage id="series.messages.error.loading" />} />;
	}

	return (
		<>
			<SerieBanner title={serie.name} background={serie && serie.links && serie.links.image ? serie.links.image : null} />
			<BookList seriesId={id} page={page} query={query} sortBy={"seriesIndex"} />
		</>
	);
};

export default SeriePage;
