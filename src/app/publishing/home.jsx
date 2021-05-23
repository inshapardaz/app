import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import BookPublishList from '../../components/books/bookPublishList.jsx';

import PublishingSideBar from '../../components/publishing/publishingSidebar';

import BookStatus from '../../models/bookStatus';

const useStyles = makeStyles((theme) => ({
	sidebar: {
		width: '100%',
		maxWidth: 360,
		paddingLeft: 8,
		backgroundColor: theme.palette.background.paper,
	},
}));

const PublishingPage = () => {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState(BookStatus.BeingTyped);

	useEffect(() => {
		const values = queryString.parse(location.search);
		setPage(values.page ? values.page : 1);
		setQuery(values.query)
		setStatus(values.status ? values.status : BookStatus.BeingTyped);
	}, [location]);

	const navigateToPage = (page, status, query = null, sortBy = null) => {

		let querystring = "";
		querystring += page ? `page=${page}&` : "";
		querystring += query ? `query=${query}&` : "";
		querystring += status ? `status=${status}&` : "";
		querystring += sortBy ? `sortBy=${sortBy}&` : "";

		if (querystring !== "") {
			querystring = `?${querystring}`.slice(0, -1);
		}
		history.push(`${location.pathname}${querystring}`);
	};

	const onSearch = (value) => {
		if (value && value.trim() !== '') {
			setQuery(value.trim());
			navigateToPage(1, status, value.trim())
		}
	}

	const onFilterChanged = (newFilter) => {
		setStatus(newFilter);
		navigateToPage(1, newFilter, query)
	}

	return (
		<Grid container>
			<Grid sm={2} item className={classes.sidebar}>
				<PublishingSideBar
					search={query} onSearch={onSearch}
					filter={status} onFilterChanged={onFilterChanged} />
			</Grid>
			<Grid sm={10} item>
				<BookPublishList query={query} status={status} page={page} />
			</Grid>
		</Grid>
	);
}

export default PublishingPage;
