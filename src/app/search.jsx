import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import PersonIcon from '@material-ui/icons/Person';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import BookList from '../components/books/bookList';
import AuthorsList from '../components/authors/authorsList';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	banner: {
		backgroundImage: `url('/images/search_background.jpg')`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		minHeight: 35,
		padding: 50,
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

const SearchPage = () => {
	const classes = useStyles();
	const intl = useIntl();
	const location = useLocation();
	const history = useHistory();
	const [value, setValue] = useState(0);
	const [query, setQuery] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	useEffect(() => {
		const values = queryString.parse(location.search);
		setPage(values.page);
		setQuery(values.q);
		setSearch(values.q);
	}, [location]);

	const handleTabChange = (event, newValue) => {
		setValue(newValue);
	};

	const keyPress = (e) => {
		if (e.keyCode === 13) {
			onSearch();
		}
	}

	const onSearch = () => {
		if (search && search.trim() !== '') {
			history.push(`/search?q=${search.trim()}`);
		}
	}

	return (
		<>
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
				</div>
			</Box>
			<Tabs
				value={value}
				onChange={handleTabChange}
				aria-label="Vertical tabs example"
				className={classes.tabs}
				centered
			>
				<Tab label="Books" icon={<LibraryBooksIcon />} {...a11yProps(0)} />
				<Tab label="Authors" icon={<PersonIcon />} {...a11yProps(1)} />
			</Tabs>
			<TabPanel value={value} index={0}>
				<BookList page={page} query={query} appendExtraParams={false} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<AuthorsList page={page} query={query} />
			</TabPanel>
		</>
	);
}

export default SearchPage;
