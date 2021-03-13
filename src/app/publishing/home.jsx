import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import BookPublishList from '../../components/books/bookPublishList.jsx';
import { Container, Toolbar, Typography } from '@material-ui/core';
import BookStatusSelect from '../../components/books/bookStatusSelect.jsx';
import { FormattedMessage, useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
	banner: {
		backgroundImage: `url('/images/search_background.jpg')`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		minHeight: 35,
		padding: 20,
		margin: '0 auto'
	},
	bannerTitle: {
		textAlign: 'center',
		fontSize: 40,
		color: '#fff'
	},
	bannerAction: {
		textAlign: 'center',
		paddingTop: 20
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	search: {
		marginTop: 50,
		marginBottom: 16,
		display: 'flex'
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
	}
}));

const PublishingPage = () => {
	const classes = useStyles();
	const intl = useIntl();
	const location = useLocation();
	const history = useHistory();
	const [search, setSearch] = useState('');
	const [query, setQuery] = useState(null);
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState('AvailableForTyping');

	useEffect(() => {
		const values = queryString.parse(location.search);
		setPage(values.page ? values.page : 1);
		setQuery(values.query)
		setSearch(values.query)
		setStatus(values.status ? values.status : 'AvailableForTyping');
	}, [location]);

	const buildLinkToPage = (page, status, query = null, sortBy = null) => {

		let querystring = "";
		querystring += page ? `page=${page}&` : "";
		querystring += query ? `query=${query}&` : "";
		querystring += status ? `status=${status}&` : "";
		querystring += sortBy ? `sortBy=${sortBy}&` : "";

		if (querystring !== "") {
			querystring = `?${querystring}`.slice(0, -1);
		}
		return `${location.pathname}${querystring}`;
	};

	const keyPress = (e) => {
		if (e.keyCode === 13) {
			onSearch();
		}
	}
	const onSearch = () => {
		if (search && search.trim() !== '') {
			history.push(`/publishing?status=${status}&query=${search.trim()}`);
		}
	}

	return (
		<Container>
			<Box>
				<div className={classes.banner}>
					<Paper align="center" className={classes.search}>
						<InputBase
							className={classes.input}
							placeholder={intl.formatMessage({ id: 'header.search.placeholder' })}
							inputProps={{ 'aria-label': 'search' }}
							value={search || ''}
							onChange={(event) => setSearch(event.target.value)}
							onKeyDown={keyPress}
						/>
						<Divider className={classes.divider} orientation="vertical" />
						<IconButton className={classes.iconButton} aria-label="search"
							onClick={onSearch}>
							<SearchIcon />
						</IconButton>
					</Paper>
					<Toolbar>
						<Typography>
							<FormattedMessage id="publishing.books.filter" />
						</Typography>
						<BookStatusSelect value={status} onStatusSelected={(s) => history.push(buildLinkToPage(page, s.key, query))} />
					</Toolbar>
				</div>
			</Box>
			<BookPublishList query={query} status={status} page={page} />
		</Container>)
}

export default PublishingPage;
