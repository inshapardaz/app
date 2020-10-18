import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import LibraryService from '../../services/LibraryService';

const Transition = React.forwardRef(function Transition (props, ref)
{
	return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteAuthor ({ show, author, onDeleted, onCancelled })
{
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);

	if (!show)
	{
		return null;
	}

	const handleDelete = async () =>
	{
		try
		{
			setBusy(true);
			await LibraryService.delete(author.links.delete);
			onDeleted();
		}
		catch (e)
		{
			console.dir(e);
			setError(true);
		}
		finally
		{
			setBusy(false);
		}
	};

	if (author === null)
	{
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
				<DialogTitle id="alert-dialog-slide-title"><FormattedMessage id="action.delete"/></DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						<FormattedMessage id="authors.action.confirmDelete" values={{ name : author.name }} />
					</DialogContentText>
					{ error && <Alert severity="error" ><FormattedMessage id="authors.messages.error.delete" /></Alert> }
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleDelete(author)} variant="contained" color="secondary">
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

export default DeleteAuthor;
