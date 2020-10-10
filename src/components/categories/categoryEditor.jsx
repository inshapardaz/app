import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
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

const CategoryEditor = ({ category, createLink }) =>
{
	const classes = useStyles();
	const intl = useIntl();
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [name, setName] = useState(false);

	const handleClose = () => setOpen(false);

	const handleSave = async () =>
	{
		setBusy(true);
		try
		{
			if (category === null && createLink !== null)
			{
				await LibraryService.post(createLink, category);
			}
			else
			{
				let cat = { ...category };
				cat.name = name;
				console.dir(cat);
				await LibraryService.put(category.links.update, cat);
			}

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

	const header = category === null ?
		intl.formatMessage({ id : 'categories.action.create' }) :
		intl.formatMessage({ id : 'category.editor.header.edit' }, { name : category.name });

	return (<>
		<IconButton edge="end" aria-label="edit" onClick={() => setOpen(true)}>
			<EditIcon />
		</IconButton>
		<Dialog
			open={open}
			onClose={handleClose}
			disableBackdropClick = {busy}
			disableEscapeKeyDown = {busy}
		>
			{busy && <CircularProgress size={24} className={classes.buttonProgress} />}
			<DialogTitle>{header}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					defaultValue={category === null ? '' : category.name }
					label={intl.formatMessage({ id : 'category.editor.fields.name.title' })}
					fullWidth
					onChange={event => setName(event.target.value) }
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSave} color="secondary" startIcon={<SaveIcon />} disabled={busy} >
					<FormattedMessage id="action.save" />
				</Button>

				<Button onClick={handleClose} color="primary" autoFocus disabled={busy}>
					<FormattedMessage id="action.cancel" />
				</Button>
			</DialogActions>
		</Dialog>
		<Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}
			anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}>
			<Alert severity="success"><FormattedMessage id="categories.messages.saved" /></Alert>
		</Snackbar>
		<Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}
			anchorOrigin={{ vertical : 'bottom', horizontal : 'left' }}>
			<Alert severity="error"><FormattedMessage id="categories.error.saving" /></Alert>
		</Snackbar>
	</>);
};

export default CategoryEditor;
