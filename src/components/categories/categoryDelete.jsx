import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { FormattedMessage, useIntl } from 'react-intl';
import LibraryService from '../../services/LibraryService';

const useStyles = makeStyles(() => ({
	buttonProgress : {
	  position : 'absolute',
	  top : '50%',
	  left : '50%',
	  marginTop : -12,
	  marginLeft : -12
	}
}));

function Alert (props)
{
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const categoryDelete = ({ category }) =>
{
	const classes = useStyles();
	const intl = useIntl();
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const handleClose = () => setOpen(false);
	const handleDelete = async () =>
	{
		setBusy(true);
		try
		{
			await  LibraryService.delete(category.links.delete);
			setSuccess(true);
			setOpen(false);
		}
		catch (e)
		{
			console.error(e);
			setFailure(true);
		}
		finally
		{
			setBusy(false);
		}
	};

	return (<>
		<Tooltip title={intl.formatMessage({ id : 'action.delete' })}>
			<IconButton edge="end" aria-label="edit" onClick={() => setOpen(true)}>
				<DeleteIcon />
			</IconButton>
		</Tooltip>
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			disableBackdropClick = {busy}
			disableEscapeKeyDown = {busy}
		>
			{busy && <CircularProgress size={24} className={classes.buttonProgress} />}
			<DialogTitle id="alert-dialog-title"><FormattedMessage id="action.delete"/></DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<FormattedMessage id="categories.action.confirmDelete" values={{ name : category.name }} />
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDelete} color="secondary" startIcon={<DeleteIcon />} disabled={busy} >
					<FormattedMessage id="action.yes" />
				</Button>

				<Button onClick={handleClose} color="primary" autoFocus disabled={busy}>
					<FormattedMessage id="action.no" />
				</Button>
			</DialogActions>
		</Dialog>
		<Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}
			anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}>
			<Alert onClose={handleClose} severity="success">
				This is a success message!
			</Alert>
		</Snackbar>
		<Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}
			anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}>
			<Alert onClose={handleClose} severity="error">
				This is a success message!
			</Alert>
		</Snackbar>
	</>);
};

export default categoryDelete;
