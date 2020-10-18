import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { DropzoneArea } from 'material-ui-dropzone';

import { FormattedMessage, useIntl } from 'react-intl';
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

const BookEditor = ({ show, book, createLink, onSaved, onCancelled  }) =>
{
	const classes = useStyles();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [publishYear, setPublishYear] = useState('');

	const handleSave = async () =>
	{
		setBusy(true);
		try
		{
			if (book === null && createLink !== null)
			{
				let obj = { title, description, publishYear };
				await LibraryService.post(createLink, obj);
			}
			else if (book !== null)
			{
				let obj = { ...book };
				obj.title = title;
				obj.description = description;
				obj.publishYear = publishYear;
				await LibraryService.put(book.links.update, obj);
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
			if (book && book.links.image_upload !== null)
			{
				await LibraryService.upload(book.links.image_upload, files[0]);
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

	const dialogTitle = book === null ?
		intl.formatMessage({ id : 'book.editor.header.add' }) :
		intl.formatMessage({ id : 'book.editor.header.edit' }, { title : book.title });

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
					<Typography variant="h6" className={classes.title}>{dialogTitle}</Typography>
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
					defaultValue={book === null ? '' : book.title }
					label={intl.formatMessage({ id : 'book.editor.fields.name.title' })}
					fullWidth
					onChange={event => setTitle(event.target.value) }
				/>
				<TextField
					margin="dense"
					id="name"
					defaultValue={book === null ? '' : book.description }
					label={intl.formatMessage({ id : 'book.editor.fields.description.title' })}
					fullWidth
					multiline
					onChange={event => setDescription(event.target.value) }
				/>
				{/*
				Author remote dropdown multiselect*
				language drop down
				category dropdown multiselect
				series dropdown
				series index
				publish year
				copyrigts dropdown
				public checkbox
				*/}
				<TextField
					margin="dense"
					id="publishYear"
					label="Number"
					type="number"
					defaultValue={book === null ? new Date().getYear() : book.publishYear }
					fullWidth
					onChange={event => setPublishYear(event.target.value) }
				/>
				{
					book && book.links.image_upload &&
					<DropzoneArea onChange={files => handleImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
				}
				{ error && <Alert severity="error" ><FormattedMessage id="books.messages.error.saving" /></Alert> }
			</DialogContent>
		</Dialog>
	);
};

export default BookEditor;
