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
import SeriesCard from './seriesCard.jsx';

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

const SeriesPage = () =>
{
	const location = useLocation();
	const [series, setSeries] = useState(null);
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
				let seriesData = await LibraryService.getSeries(values.query, values.page);
				setSeries(seriesData);
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

	const renderSeries = () =>
	{
		if (isLoading)
		{
			return (<CircularProgress />);
		}

		if (isError)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="series.messages.error.loading" />
			</Typography>);
		}

		if (series === null || series.data === null || series.data.length < 1)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="series.messages.empty" />
			</Typography>);
		}

		return (<Grid container spacing={4}>{series.data.map(s => (
			<Grid item key={s.id} xs={12} sm={6} md={4}>
				<SeriesCard series={s} key={s.id} />
			</Grid>))}
		</Grid>);
	};

	const renderPagination = () =>
	{
		if (!isLoading && series)
		{
			return <Pagination
				page={series.currentPageIndex}
				count={series.pageCount}
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
		return <ErrorMessage message={<FormattedMessage id="series.messages.error.loading" />} />;
	}

	return (
		<>
			<Box>
				<Typography variant="h3"><FormattedMessage id="header.series" /></Typography>
			</Box>
			<Grid container spacing={3}>
				{renderSeries()}
				{renderPagination()}
			</Grid>
		</>
	);
};

export default SeriesPage;
