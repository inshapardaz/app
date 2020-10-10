import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { FormattedMessage } from 'react-intl';
import LibraryService from '../../services/LibraryService';
import BookCard from './bookCard.jsx';

const useStyles = () => makeStyles((theme) => ({
	cardGrid : {
	  paddingTop : theme.spacing(8),
	  paddingBottom : theme.spacing(8)
	}
}));
const classes = useStyles();

// eslint-disable-next-line max-params
const buildLinkToPage = (page, authorId, categoryId, seriesId, query) =>
{
	const location = useLocation();

	let querystring = '';
	querystring += page ? `page=${page}` : '';
	querystring += authorId ? `author=${authorId}` : '';
	querystring += categoryId ? `category=${categoryId}` : '';
	querystring += seriesId ? `series=${seriesId}` : '';
	querystring += query ? `query=${query}` : '';
	if (querystring !== '')
	{
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};

const BookList = () =>
{
	const location = useLocation();
	const [books, setBooks] = useState(null);
	const [authorId, setAuthorId] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [seriesId, setSeriesId] = useState(null);
	const [query, setQuery] = useState(true);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
		const fetchData = async () =>
		{
			const values = queryString.parse(location.search);
			const page = values.page;
			const q = values.q;
			const category = values.category;
			const author = values.author;
			const series = values.series;
			try
			{
				const data = await LibraryService.getBooks(
					author ? author : null,
					category ? category : null,
					series ? series : null,
					q ? q : null,
					page
				);

				setAuthorId(author);
				setCategoryId(category);
				setSeriesId(series);
				setQuery(q);
				setBooks(data);
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
		fetchData();
	}, [location]);

	const renderBooks = () =>
	{
		if (isLoading)
		{
			return (<CircularProgress />);
		}

		if (isError)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="books.messages.error.loading" />
			</Typography>);
		}

		if (books === null || books.data === null || books.data.length < 1)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="books.messages.empty" />
			</Typography>);
		}

		return (<Grid container spacing={4}>{books.data.map((b) => (
			<Grid item key={b.id} xs={12} sm={6} md={4}>
				<BookCard book={b} key={b.id}/>
			</Grid>)) }
		</Grid>);
	};

	const renderPagination = () =>
	{
		if (!isLoading && books)
		{
			return <Pagination
				page={books.currentPageIndex}
				count={books.pageCount}
				renderItem={(item) => (
					<PaginationItem
						component={Link}
						to={buildLinkToPage(item.page, authorId, categoryId, seriesId, query)}
						{...item}
					/>
				)}
			/>;
		}

		return null;
	};

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderBooks()}
			{renderPagination()}
		</Container>);
};

export default BookList;
