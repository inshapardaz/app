
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Loading from '../Loading.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import LibraryService from '../../services/LibraryService';
import AuthorCard from './authorCard.jsx';

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
	const location = useLocation();
	const [authors, setAuthors] = useState(null);
	const [query, setQuery] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
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

		loadData();
	}, [location]);

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

		return (<Grid container spacing={4}>{authors.data.map(a => (
			<Grid item key={a.id} xs={12} sm={6} md={4}>
				<AuthorCard author={a} key={a.id}/>
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
			<Box>
				<Typography variant="h3"><FormattedMessage id="header.authors" /></Typography>
			</Box>
			<Grid container spacing={3}>
				{renderAuthors()}
				{renderPagination()}
			</Grid>
		</>
	);
};

export default AuthorsPage;
