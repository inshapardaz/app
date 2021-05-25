import React from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { blue } from '@material-ui/core/colors';
import { FormattedMessage, useIntl } from "react-intl";
import WritersDropDown from '../account/writersDropdown';
import { libraryService } from "../../services";
import { TextField } from '@material-ui/core';


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
	const [key, setKey] = React.useState('');

	const { onClose, open, selectedPages } = props;

	const handleClose = () => {
		onClose();
	};

	const handleSubmit = () => {
		var promises = [];

		selectedPages.map(page => {
			if (page !== null && page !== undefined) {
				if (page.links.ocr) {
					return promises.push(libraryService.post(page.links.ocr, key));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.assigned' }), { variant: 'success' }))
			.then(() => handleClose())
			.catch(e => console.error(e))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.assigned' }), { variant: 'error' }));
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth='sm' fullWidth>
			<DialogTitle id="simple-dialog-title"><FormattedMessage id="pages.ocr" /></DialogTitle>
			<DialogContent>
				<FormattedMessage id="pages.ocr.description" />
				<TextField
					autoFocus
					margin="dense"
					id="key"
					value={key}
					onChange={(event) => setKey(event.target.value)}
					label={intl.formatMessage({ id: 'pages.ocr.title' })}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} variant="contained" >
					<FormattedMessage id="action.cancel" />
				</Button>
				<Button onClick={handleSubmit} disabled={!key} variant="contained" color="primary">
					<FormattedMessage id="pages.ocr" />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PageOcrButton = ({ selectedPages }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<FindInPageIcon />}>
				<FormattedMessage id="pages.ocr" />
			</Button>
			<SimpleDialog open={open} onClose={handleClose} selectedPages={selectedPages} />
		</>
	);
};

export default PageOcrButton;
