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
import LayersIcon from '@material-ui/icons/Layers';
import { FormattedMessage, useIntl } from "react-intl";
import { blue } from '@material-ui/core/colors';
import { libraryService } from "../../services";

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

function SimpleDialog(props) {
	const classes = useStyles();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const { onClose, open, book, selectedPages, onUpdated } = props;
	const [chapters, setChapters] = useState(null);

	const handleClose = (success = false) => {
		if (success && onUpdated) onUpdated();
		onClose();
	};

	const handleListItemClick = (chapter) => {
		var promises = [];
		selectedPages.map(p => {
			if (p !== null && p !== undefined) {
				if (p.links.update) {
					p.chapterId = chapter.id;
					return promises.push(libraryService.put(p.links.update, p));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'message.saved' }), { variant: 'success' }))
			.then(() => handleClose(true))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'message.error.saving' }), { variant: 'error' }));
	};

	useEffect(() => {
		libraryService
			.getBookChapters(book)
			.then((response) => {
				setChapters(response.data);
			})
	}, [open]);

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title"><FormattedMessage id="pages.associateWithChapter" /></DialogTitle>
			<List>
				{chapters != null && chapters.map((chapter) => (
					<ListItem button onClick={() => handleListItemClick(chapter)} key={chapter.id}>
						<ListItemAvatar>
							<Avatar className={classes.avatar}>
								<LayersIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={chapter.title} />
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

const PageChapterAssignButton = ({ book, selectedPages, onUpdated }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<LinkIcon />}>
				<FormattedMessage id="pages.associateWithChapter" />
			</Button>
			<SimpleDialog open={open} onClose={handleClose} book={book} selectedPages={selectedPages} onUpdated={onUpdated} />
		</>
	);
};

export default PageChapterAssignButton;
