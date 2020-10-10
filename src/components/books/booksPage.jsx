import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage, useIntl } from 'react-intl';
import CategoriesList from '../categories/categoriesList.jsx';
import LibraryService from '../../services/LibraryService';
import BookList from './bookList.jsx';
import Loading from '../Loading.jsx';
import ErrorMessage from '../ErrorMessage.jsx';

const BooksPage = () =>
{
	const intl = useIntl();
	const location = useLocation();
	const [authorId, setAuthorId] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [seriesId, setSeriesId] = useState(null);
	const [author, setAuthor] = useState(null);
	const [category, setCategory] = useState(null);
	const [series, setSeries] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
		const loadData = async () =>
		{
			const values = queryString.parse(location.search);
			setCategoryId(values.category);
			setAuthorId(values.author);
			setSeriesId(values.series);

			try {
				setLoading(true);

				if (authorId > 0)
				{
					let authorData = await LibraryService.getAuthor(authorId);
					setAuthor({ authorData });
				}

				if (categoryId > 0)
				{
					let categoryData = await LibraryService.getCategory(categoryId);
					setCategory({ categoryData });
				}

				if (seriesId > 0)
				{
					let seriesData = await LibraryService.getSeriesById(seriesId);
					setSeries({ seriesData });
				}
			}
			catch (e)
			{
				console.dir(e);
				setError(true);
			}
			finally
			{
				setLoading(false);
			}
		};

		loadData();
	}, [location]);

	let headerContent = intl.formatMessage({ id : 'header.books' });
	if (author)
	{
		headerContent = author.name;
	}
	else if (category)
	{
		headerContent = category.name;
	}
	else if (series)
	{
		headerContent = series.name;
	}

	if (isLoading)
	{
		return <Loading />;
	}
	if (isError)
	{
		return <ErrorMessage message={<FormattedMessage id="books.messages.error.loading" />}/>;
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
					<BookList />
				</Grid>
			</Grid>
		</>
	);
};

export default BooksPage;
