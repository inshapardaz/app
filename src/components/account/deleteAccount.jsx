import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { libraryService } from '../../services';
import { useSnackbar } from 'notistack';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteAccount({ show, account, onDeleted, onCancelled }) {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const intl = useIntl();

	if (!show) {
		return null;
	}

	const handleDelete = () => {
		setBusy(true);
		libraryService.delete(account.links.delete)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'account.delete.success' }, { name: account.name }), { variant: 'success' })
				onDeleted();
			})
			.catch(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'account.delete.error' }), { variant: 'error' })
				setError(true);
			})
			.finally(() => setBusy(false));
	};

	if (account === null) {
		return null;
	}

	return (
		<>
			<Dialog
				open={true}
				TransitionComponent={Transition}
				keepMounted
				onClose={onCancelled}
				onBackdropClick={onCancelled}
				onEscapeKeyDown={onCancelled}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				disableEscapeKeyDown={busy}
				disableBackdropClick={busy}
			>
				<DialogTitle id="alert-dialog-slide-title"><FormattedMessage id="action.delete" /></DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						<FormattedMessage id="account.delete.confirm" values={{ name: `${account.name}` }} />
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleDelete(account)} variant="contained" color="secondary">
						<FormattedMessage id="action.yes" />
					</Button>
					<Button onClick={onCancelled} variant="contained">
						<FormattedMessage id="action.no" />
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default DeleteAccount;
