import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Loading from '../Loading.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import LibraryService from '../../services/LibraryService';
import AuthorsBanner from './authorsBanner.jsx';
import AuthorCard from './authorCard.jsx';
import AuthorEditor from './authorEditor.jsx';
import DeleteAuthor from './deleteAuthor.jsx';

const useStyles = makeStyles({
	cellGrid : {
		padding : 60
	}
});

const buildLinkToPage = (page, query) =>
{
	const location = useLocation();

	let querystring = '';
	querystring += page ? `page=${page}` : '';
	querystring += query ? `query=${query}` : '';
	if (querystring !== '')
	{
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};

const AuthorsPage = () =>
{
	const classes = useStyles();
	const location = useLocation();
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [authors, setAuthors] = useState(null);
	const [selectedAuthor, setSelectedAuthor] = useState(null);
	const [query, setQuery] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = async () =>
	{
		const values = queryString.parse(location.search);

		try
		{
			let authorsData = await LibraryService.getAuthors(values.query, values.page);
			setAuthors(authorsData);
			setQuery(values.query);
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
		setSelectedAuthor(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const onDeleteClicked = useCallback(author =>
	{
		setSelectedAuthor(author);
		setShowDelete(true);
	}, [location]);

	const onEditClicked = useCallback(author =>
	{
		setSelectedAuthor(author);
		setShowEditor(true);
	}, [location]);

	const handleDataChanged = () =>
	{
		handleClose();
		loadData();
	};

	const renderAuthors = () =>
	{
		if (isLoading)
		{
			return (<CircularProgress />);
		}

		if (isError)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="authors.messages.error.loading" />
			</Typography>);
		}

		if (authors === null || authors.data === null || authors.data.length < 1)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="authors.messages.empty" />
			</Typography>);
		}

		return (<Grid className={classes.cellGrid} container spacing={4}>{authors.data.map(a => (
			<Grid item key={a.id} xs={12} sm={6} md={3} lg={2}>
				<AuthorCard author={a} key={a.id} onEdit={onEditClicked} onDelete={onDeleteClicked}/>
			</Grid>)) }
		</Grid>);
	};

	const renderPagination = () =>
	{
		if (!isLoading && authors)
		{
			return <Pagination
				page={authors.currentPageIndex}
				count={authors.pageCount}
				renderItem={(item) => (
					<PaginationItem
						component={Link}
						to={buildLinkToPage(item.page, query)}
						{...item}
					/>
				)}
			/>;
		}

		return null;
	};

	if (isLoading)
	{
		return <Loading />;
	}
	if (isError)
	{
		return <ErrorMessage message={<FormattedMessage id="authors.messages.error.loading" />}/>;
	}

	return (
		<>
			<AuthorsBanner title={<FormattedMessage id="header.authors" />}
				createLink={authors && authors.links.create} onCreate={() => onEditClicked(null)} />
			<Grid container spacing={3}>
				{renderAuthors()}
				{renderPagination()}
			</Grid>
			<AuthorEditor show={showEditor}
				author={selectedAuthor}
				createLink={authors && authors.links.create}
				onSaved={handleDataChanged}
				onCancelled={handleClose} />
			<DeleteAuthor show={showDelete}
				author={selectedAuthor}
				onDeleted={handleDataChanged}
				onCancelled={handleClose} />
		</>
	);
};

export default AuthorsPage;
