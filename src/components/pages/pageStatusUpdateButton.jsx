import React, { useState, useEffect, useCallback } from "react";
import { useSnackbar } from 'notistack';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinkIcon from '@material-ui/icons/Link';
import InfoIcon from '@material-ui/icons/Info';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import RateReviewIcon from '@material-ui/icons/RateReview';
import DoneIcon from '@material-ui/icons/Done';

import { FormattedMessage, useIntl } from "react-intl";
import { blue } from '@material-ui/core/colors';
import { libraryService } from "../../services";
import PageStatus from '../../models/pageStatus';

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

const getStatusIcon = (status) => {
	switch (status) {
		case PageStatus.AvailableForTyping:
			return (<HourglassEmptyIcon />);
		case PageStatus.Typing:
			return (<KeyboardHideIcon />);
		case PageStatus.Typed:
			return (<SpellcheckIcon />);
		case PageStatus.InReview:
			return (<RateReviewIcon />);
		case PageStatus.Completed:
			return (<DoneIcon />);
	}
}

function SimpleDialog(props) {
	const classes = useStyles();
	const intl = useIntl();
	const [dataChanged, setDataChanged] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const { onClose, open, selectedPages, onUpdated } = props;

	const handleClose = () => {
		if (dataChanged && onUpdated) {
			onUpdated();
		}

		onClose();
	};

	const handleListItemClick = (newStatus) => {
		var promises = [];
		selectedPages.map(p => {
			if (p !== null && p !== undefined) {
				if (p.links.update) {
					p.status = newStatus;
					return promises.push(libraryService.put(p.links.update, p).then(() => setDataChanged(true)));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'message.saved' }), { variant: 'success' }))
			.then(() => handleClose(true))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'message.error.saving' }), { variant: 'error' }));
	};

	var items = []
	for (const [key, value] of Object.entries(PageStatus)) {
		items.push({ key, value });
	}


	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title"><FormattedMessage id="pages.setStatus" /></DialogTitle>
			<List>
				{items.map((item) => (
					<ListItem button onClick={() => handleListItemClick(item.value)} key={item.key}>
						<ListItemAvatar>
							<Avatar className={classes.avatar}>
								{getStatusIcon(item.value)}
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={intl.formatMessage({ id: `status.${item.value}` })} />
					</ListItem>
				))}
			</List>
		</Dialog>
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PageStatusUpdateButton = ({ selectedPages, onUpdated }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<InfoIcon />}>
				<FormattedMessage id="pages.setStatus" />
			</Button>
			<SimpleDialog open={open} onClose={handleClose} selectedPages={selectedPages} onUpdated={onUpdated} />
		</>
	);
};

export default PageStatusUpdateButton;
