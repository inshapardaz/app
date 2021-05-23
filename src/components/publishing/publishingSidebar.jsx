import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';


import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import RateReviewIcon from '@material-ui/icons/RateReview';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import BookStatus from '../../models/bookStatus';
import BookEditor from "../books/bookEditor";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	search: {
		display: 'flex'
	}
}));

const SearchBox = ({ value, onSearch }) => {
	const classes = useStyles();

	const intl = useIntl();
	const [search, setSearch] = useState('');

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const keyPress = (e) => {
		if (e.keyCode === 13) {
			handleSearch(search);
		}
	}
	const handleSearch = () => {
		if (search && search.trim() !== '' && onSearch) {
			onSearch(search);
		}
	}

	return (
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
				onClick={handleSearch}>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}

const PublishingSideBar = ({ search, filter, createLink, onSearch, onFilterChanged }) => {
	const classes = useStyles();
	const intl = useIntl();
	const [showEditor, setShowEditor] = useState(false);

	const renderFilters = () => {
		return (<>
			<ListItem button key={BookStatus.Published} onClick={() => onFilterChanged(BookStatus.Published)} selected={BookStatus.Published === filter}>
				<ListItemIcon>
					<CloudDoneIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.Published` })} />
			</ListItem>
			<ListItem button key={BookStatus.AvailableForTyping} onClick={() => onFilterChanged(BookStatus.AvailableForTyping)} selected={BookStatus.AvailableForTyping === filter}>
				<ListItemIcon>
					<HourglassEmptyIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.AvailableForTyping` })} />
			</ListItem>
			<ListItem button key={BookStatus.BeingTyped} onClick={() => onFilterChanged(BookStatus.BeingTyped)} selected={BookStatus.BeingTyped === filter}>
				<ListItemIcon>
					<KeyboardIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.BeingTyped` })} />
			</ListItem>
			<ListItem button key={BookStatus.ReadyForProofRead} onClick={() => onFilterChanged(BookStatus.ReadyForProofRead)} selected={BookStatus.ReadyForProofRead === filter}>
				<ListItemIcon>
					<InsertCommentIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.ReadyForProofRead` })} />
			</ListItem>
			<ListItem button key={BookStatus.ProofRead} onClick={() => onFilterChanged(BookStatus.ProofRead)} selected={BookStatus.ProofRead === filter}>
				<ListItemIcon>
					<RateReviewIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.ProofRead` })} />
			</ListItem>
		</>);
	}

	const onAddClicked = () => {
		setShowEditor(true);
	}

	const handleClose = () => {
		setShowEditor(false);
	};

	return (
		<div className={classes.root}>
			<List component="nav" aria-label="main mailbox folders">
				<SearchBox value={search} onSearch={onSearch} />
				{createLink && <ListItem button onClick={onAddClicked}>
					<ListItemIcon>
						<AddCircleIcon />
					</ListItemIcon>
					<ListItemText primary={intl.formatMessage({ id: `books.action.create` })} />
				</ListItem>}
			</List>
			<Divider />
			<List component="nav" aria-label="secondary mailbox folders">
				<ListSubheader component="div">
					<FormattedMessage id="publishing.books.filter" />
				</ListSubheader>
				{renderFilters()}
			</List>
			{ createLink &&
				<BookEditor
					show={showEditor}
					createLink={createLink}
					onCancelled={handleClose}
				/>
			}
		</div>
	);
};

export default PublishingSideBar;
