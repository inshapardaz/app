import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import { DropzoneArea } from 'material-ui-dropzone';
import LibraryService from '../../services/LibraryService';

const useStyles = makeStyles((theme) => ({
	appBar : {
		position : 'relative'
	},
	title : {
		marginLeft : theme.spacing(2),
		flex : 1
	}
}));

const Transition = React.forwardRef(function Transition (props, ref)
{
	return <Slide direction="up" ref={ref} {...props} />;
});

const AuthorEditor = ({ show, author, createLink, onSaved, onCancelled }) =>
{
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [name, setName] = useState('');

	const handleSave = async () =>
	{
		setBusy(true);
		try
		{
			if (author === null && createLink !== null)
			{
				let cat = { name };
				await LibraryService.post(createLink, cat);
			}
			else if (author !== null)
			{
				let cat = { ...author };
				cat.name = name;
				await LibraryService.put(author.links.update, cat);
			}

			onSaved();

		}
		catch (e)
		{
			console.error(e);
			setError(true);
		}
		finally
		{
			setBusy(false);
		}
	};

	const handleImageUpload = async (files) =>
	{
		if (files.length < 1)
		{
			return;
		}

		setBusy(true);
		try
		{
			if (author && author.links.image_upload !== null)
			{
				await LibraryService.upload(author.links.image_upload, files[0]);
			}

			onSaved();

		}
		catch (e)
		{
			console.error(e);
			setError(true);
		}
		finally
		{
			setBusy(false);
		}
	};

	const classes = useStyles();
	const title = author === null
		? intl.formatMessage({ id : 'author.editor.header.add' })
		: intl.formatMessage({ id : 'author.editor.header.edit', values : { name : author.name } });

	return (
		<Dialog fullScreen open={show}
			onClose={() => onCancelled()}
			TransitionComponent={Transition}
			disableEscapeKeyDown={busy}
			disableBackdropClick={busy}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={() => onCancelled()} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>{title}</Typography>
					<Button autoFocus color="inherit" onClick={handleSave}>
						<FormattedMessage id="action.save" />
					</Button>
				</Toolbar>
			</AppBar>
			 <DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					defaultValue={author === null ? '' : author.name }
					label={intl.formatMessage({ id : 'author.editor.fields.name.title' })}
					fullWidth
					onChange={event => setName(event.target.value) }
				/>

				{
					author && author.links.image_upload &&
					<DropzoneArea onChange={files => handleImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
				}

				{ error && <Alert severity="error" ><FormattedMessage id="categories.messages.error.saving" /></Alert> }
			</DialogContent>
		</Dialog>
	);
};

export default AuthorEditor;
