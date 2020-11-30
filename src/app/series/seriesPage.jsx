import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import { libraryService } from '../../services';
import SeriesBanner from '../../components/series/seriesBanner.jsx';
import SeriesCard from '../../components/series/seriesCard.jsx';
import { Box } from '@material-ui/core';
import SeriesEditor from '../../components/series/seriesEditor.jsx';
import DeleteSeries from '../../components/series/deleteSeries.jsx';

const useStyles = makeStyles({
	cellGrid: {
		padding: 60
	}
});

const buildLinkToPage = (page, query) => {
	const location = useLocation();

	let querystring = '';
	querystring += page ? `page=${page}` : '';
	querystring += query ? `query=${query}` : '';
	if (querystring !== '') {
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};

const SeriesPage = () => {
	const classes = useStyles();
	const location = useLocation();
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [series, setSeries] = useState(null);
	const [selectedSeries, setSelectedSeries] = useState(null);
	const [query, setQuery] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		const values = queryString.parse(location.search);

		libraryService.getSeries(values.query, values.page)
			.then(data => {
				setSeries(data);
				setQuery(values.query);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [location]);

	const handleClose = () => {
		setSelectedSeries(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const onDeleteClicked = useCallback(serie => {
		setSelectedSeries(serie);
		setShowDelete(true);
	}, [location]);

	const onEditClicked = useCallback(serie => {
		setSelectedSeries(serie);
		setShowEditor(true);
	}, [location]);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const renderSeries = () => {
		if (isLoading) {
			return (<CircularProgress />);
		}

		if (isError) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="series.messages.error.loading" />
			</Typography>);
		}

		if (series === null || series.data === null || series.data.length < 1) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="series.messages.empty" />
			</Typography>);
		}

		return (<Grid className={classes.cellGrid} container spacing={4}>{series.data.map(s => (
			<Grid item key={s.id} xs={12} sm={6} md={4}>
				<SeriesCard series={s} key={s.id} onEdit={onEditClicked} onDelete={onDeleteClicked} />
			</Grid>))}
		</Grid>);
	};

	const renderPagination = () => {
		if (!isLoading && series) {
			return <Box m={8}>
				<Pagination
					page={series.currentPageIndex}
					count={series.pageCount}
					variant="outlined" shape="rounded"
					renderItem={(item) => (
						<PaginationItem
							component={Link}
							to={buildLinkToPage(item.page, query)}
							{...item}
						/>
					)}
				/>
			</Box>;
		}

		return null;
	};

	if (isLoading) {
		return <Loading />;
	}
	if (isError) {
		return <ErrorMessage message={<FormattedMessage id="series.messages.error.loading" />} />;
	}

	return (
		<>
			<SeriesBanner title={<FormattedMessage id="header.series" />}
				createLink={series && series.links.create} onCreate={() => onEditClicked(null)} />
			<Grid container spacing={3}>
				{renderSeries()}
				{renderPagination()}
			</Grid>
			<SeriesEditor show={showEditor}
				series={selectedSeries}
				createLink={series && series.links.create}
				onSaved={handleDataChanged}
				onCancelled={handleClose} />
			<DeleteSeries show={showDelete}
				series={selectedSeries}
				onDeleted={handleDataChanged}
				onCancelled={handleClose} />
		</>
	);
};

export default SeriesPage;
