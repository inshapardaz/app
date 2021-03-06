import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import LayersIcon from '@material-ui/icons/Layers';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import DoneIcon from '@material-ui/icons/Done';
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PersonIcon from '@material-ui/icons/Person';
import RateReviewIcon from '@material-ui/icons/RateReview';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PageStatus from '../../models/pageStatus';
import BookEditor from '../books/bookEditor';
import { Typography } from '@material-ui/core';
import BookDownloadButton from '../books/bookDownloadButton';
import BookPublishButton from '../books/bookPublishButton';
import BookProgress from '../books/bookProgress';

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
	}
}));

const getPageCountInStatus = (book, status) => {
	if (book && book.pageStatus) {
		let stat = book.pageStatus.find(s => s.status === status);

		if (stat) {
			return stat.count;
		}

		return 0;
	}

	return null;
}

const PagesSidebar = ({ book, filter, onStatusFilter, onUpdated, assignmentFilter, onAssignmentFilterChanged }) => {
	const intl = useIntl();
	const classes = useStyles();
	const [showEditor, setShowEditor] = useState(false);

	const renderEditLink = () => {
		if (book && book.links && book.links.update) {
			return (
				<ListItem button key='editBook' onClick={() => setShowEditor(true)}>
					<ListItemIcon>
						<EditOutlinedIcon />
					</ListItemIcon>
					<ListItemText primary={intl.formatMessage({ id: `action.edit` })} />
				</ListItem>);
		}
		return null;
	};

	const renderChaptersLink = () => {
		if (book && book.links && book.links.update) {
			return (<ListItem button component={Link} to={`/books/${book.id}/chapters`}>
				<ListItemIcon>
					<LayersIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `chapter.toolbar.chapters` })} />
			</ListItem>);
		}
		return null;
	}

	const handleBookUpChanged = () => {
		setShowEditor(false);
		onUpdated && onUpdated();
	}

	const renderStatusFilters = () => {
		return (<>
			<ListItem button key='AllPages' onClick={() => onStatusFilter('all')} selected={filter === 'all'}>
				<ListItemIcon>
					<PhotoFilterIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.all` })} secondary={book.pageCount} />
			</ListItem>
			<ListItem button key={PageStatus.AvailableForTyping} onClick={() => onStatusFilter(PageStatus.AvailableForTyping)} selected={PageStatus.AvailableForTyping === filter}>
				<ListItemIcon>
					<HourglassEmptyIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.AvailableForTyping` })} secondary={getPageCountInStatus(book, PageStatus.AvailableForTyping)} />
			</ListItem>
			<ListItem button key={PageStatus.Typing} onClick={() => onStatusFilter(PageStatus.Typing)} selected={PageStatus.Typing === filter}>
				<ListItemIcon>
					<KeyboardHideIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.BeingTyped` })} secondary={getPageCountInStatus(book, PageStatus.Typing)} />
			</ListItem>
			<ListItem button key={PageStatus.Typed} onClick={() => onStatusFilter(PageStatus.Typed)} selected={PageStatus.Typed === filter}>
				<ListItemIcon>
					<SpellcheckIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.ReadyForProofRead` })} secondary={getPageCountInStatus(book, PageStatus.Typed)} />
			</ListItem>
			<ListItem button key={PageStatus.InReview} onClick={() => onStatusFilter(PageStatus.InReview)} selected={PageStatus.InReview === filter}>
				<ListItemIcon>
					<RateReviewIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.ProofRead` })} secondary={getPageCountInStatus(book, PageStatus.InReview)} />
			</ListItem>
			<ListItem button key={PageStatus.Completed} onClick={() => onStatusFilter(PageStatus.Completed)} selected={PageStatus.Completed === filter}>
				<ListItemIcon>
					<DoneIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `book.status.Completed` })} secondary={getPageCountInStatus(book, PageStatus.Completed)} />
			</ListItem>
		</>);
	}

	const renderAssignmentFilter = () => {
		return (<>
			<ListItem button key={'all'} onClick={() => onAssignmentFilterChanged('all')} selected={assignmentFilter === 'all'}>
				<ListItemIcon>
					<FileCopyIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.assign.all` })} />
			</ListItem>
			<ListItem button key={'assignedToMe'} onClick={() => onAssignmentFilterChanged('assignedToMe')} selected={assignmentFilter === 'assignedToMe'}>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.assign.assignedToMe` })} />
			</ListItem>

			<ListItem button key={'assigned'} onClick={() => onAssignmentFilterChanged('assigned')} selected={assignmentFilter === 'assigned'}>
				<ListItemIcon>
					<PeopleAltIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.assign.assigned` })} />
			</ListItem>

			<ListItem button key={'unassigned'} onClick={() => onAssignmentFilterChanged('unassigned')} selected={assignmentFilter === 'unassigned'}>
				<ListItemIcon>
					<PersonOutlineIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.assign.unassigned` })} />
			</ListItem>
		</>);
	};

	return (
		<div className={classes.root}>
			<Typography variant="h5">{book != null ? book.title : ''}</Typography>
			<BookProgress book={book} />
			{renderEditLink()}
			{renderChaptersLink()}
			<BookDownloadButton book={book} />
			<BookPublishButton book={book} />
			<Divider />
			<List component="nav" aria-label="status filters" dense>
				{renderStatusFilters()}
			</List>
			<Divider />
			<List component="nav" aria-label="assignment filters" dense>
				{renderAssignmentFilter()}
			</List>
			<Divider />
			<BookEditor
				show={showEditor}
				book={book}
				onSaved={handleBookUpChanged}
				onCancelled={() => setShowEditor(false)}
			/>
		</div>
	);
};

export default PagesSidebar;
