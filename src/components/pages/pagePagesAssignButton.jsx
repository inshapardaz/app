import React from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { blue } from '@material-ui/core/colors';
import { FormattedMessage, useIntl } from "react-intl";
import WritersDropDown from '../account/writersDropdown';
import { libraryService } from "../../services";


const emails = ['username@gmail.com', 'user02@gmail.com'];
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
	const [selectedAccount, setSelectedAccount] = React.useState(null);

	const { onClose, open, selectedPages, onAssigned } = props;

	const handleClose = (success = false) => {
		if (success && onAssigned) {
			onAssigned();
		}
		onClose();
	};

	const handleSubmit = () => {
		var promises = [];

		selectedPages.map(page => {
			if (page !== null && page !== undefined) {
				if (page.links.assign) {
					return promises.push(libraryService.post(page.links.assign, { AccountId: selectedAccount.id }));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.assigned' }), { variant: 'success' }))
			.then(() => handleClose(true))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.assigned' }), { variant: 'error' }));
	};

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth='sm' fullWidth>
			<DialogTitle id="simple-dialog-title"><FormattedMessage id="pages.assignToUser" /></DialogTitle>
			<DialogContent>
				<WritersDropDown onWriterSelected={(value) => setSelectedAccount(value)} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} variant="contained" >
					<FormattedMessage id="action.cancel" />
				</Button>
				<Button onClick={handleSubmit} variant="contained" color="primary" disabled={!selectedAccount}>
					<FormattedMessage id="action.save" />
				</Button>
			</DialogActions>
		</Dialog>
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PagePagesAssignButton = ({ selectedPages, onAssigned }) => {
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(emails[1]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value) => {
		setOpen(false);
		setSelectedValue(value);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<PersonAddIcon />}>
				<FormattedMessage id="pages.assignToUser" />
			</Button>
			<SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} onAssigned={onAssigned} selectedPages={selectedPages} />
		</>
	);
};

export default PagePagesAssignButton;
