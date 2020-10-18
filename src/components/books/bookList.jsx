import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { FormattedMessage } from 'react-intl';
import LibraryService from '../../services/LibraryService';
import BookCard from './bookCard.jsx';
import BookEditor from './bookEditor.jsx';
import DeleteBook from './deleteBook.jsx';

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
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [books, setBooks] = useState(null);
	const [authorId, setAuthorId] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [seriesId, setSeriesId] = useState(null);
	const [query, setQuery] = useState(true);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = async () =>
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

	useEffect(() =>
	{
		loadData();
	}, [location]);

	const handleClose = () =>
	{
		setSelectedBook(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const onDeleteClicked = useCallback(book =>
	{
		setSelectedBook(book);
		setShowDelete(true);
	}, [books]);

	const onEditClicked = useCallback(book =>
	{
		setSelectedBook(book);
		setShowEditor(true);
	}, [books]);

	const handleDataChanged = () =>
	{
		handleClose();
		loadData();
	};

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
				<BookCard book={b} key={b.id} onEdit={onEditClicked} onDelete={onDeleteClicked}/>
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

	const renderToolBar = () =>
	{
		if (books && books.links.create)
		{
			return (<Toolbar>
				<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => onEditClicked(null)}>
					<AddCircleIcon />
				</IconButton>
			</Toolbar>);
		}

		return null;
	};

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderBooks()}
			{renderPagination()}
			<BookEditor show={showEditor}
				book={selectedBook}
				createLink={books && books.links.create}
				onSaved={handleDataChanged}
				onCancelled={handleClose} />
			<DeleteBook show={showDelete}
				book={selectedBook}
				onDeleted={handleDataChanged}
				onCancelled={handleClose} />
		</Container>);
};

export default BookList;
