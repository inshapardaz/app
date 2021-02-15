import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage, useIntl } from 'react-intl';
import CategoriesList from '../../components/categories/categoriesList.jsx';
import { libraryService } from '../../services';
import BookList from '../../components/books/bookList.jsx';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const BooksPage = () => {
	const intl = useIntl();
	const location = useLocation();
	const [authorId, setAuthorId] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [seriesId, setSeriesId] = useState(null);
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(null);
	const [author, setAuthor] = useState(null);
	const [category, setCategory] = useState(null);
	const [series, setSeries] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() => {
		const loadData = () => {
			const values = queryString.parse(location.search);
			setPage(values.page);
			setQuery(values.q)
			setCategoryId(values.category);
			setAuthorId(values.author);
			setSeriesId(values.series);

			setLoading(true);

			if (authorId > 0) {
				libraryService.getAuthor(authorId)
					.then(data => setAuthor({ data }))
					.catch(() => setError(true));
			}

			if (categoryId > 0) {
				libraryService.getCategory(categoryId)
					.then(data => setCategory({ data }))
					.catch(() => setError(true));
			}

			if (seriesId > 0) {
				libraryService.getSeriesById(seriesId)
					.then(data => setSeries({ data }))
					.catch(() => setError(true));
			}
			setLoading(false);
		};

		loadData();
	}, [location]);

	let headerContent = intl.formatMessage({ id: 'header.books' });
	if (author) {
		headerContent = author.name;
	}
	else if (category) {
		headerContent = category.name;
	}
	else if (series) {
		headerContent = series.name;
	}

	if (isLoading) {
		return <Loading />;
	}
	if (isError) {
		return <ErrorMessage message={<FormattedMessage id="books.messages.error.loading" />} />;
	}

	return (
		<>
			<Box>
				<Typography variant="h3">{headerContent}</Typography>
			</Box>
			<Grid container spacing={3}>
				<Grid item xs={2}>
					<CategoriesList />
				</Grid>
				<Grid item xs={10}>
					<BookList page={page} query={query} authorId={authorId} categoryId={categoryId} seriesId={seriesId} appendExtraParams={true} />
				</Grid>
			</Grid>
		</>
	);
};

export default BooksPage;
