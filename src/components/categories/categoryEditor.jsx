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

const CategoryEditor = ({ show, category, createLink, onSaved, onCancelled  }) =>
{
	const classes = useStyles();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [name, setName] = useState('');

	const handleClose = () => setOpen(false);

	const handleSave = async () =>
	{
		setBusy(true);
		try
		{
			if (category === null && createLink !== null)
			{
				let cat = { name };
				await LibraryService.post(createLink, cat);
			}
			else if (category !== null)
			{
				let cat = { ...category };
				cat.name = name;
				await LibraryService.put(category.links.update, cat);
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

	const title = category === null ?
		intl.formatMessage({ id : 'categories.action.create' }) :
		intl.formatMessage({ id : 'category.editor.header.edit' }, { name : category.name });

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
					defaultValue={category === null ? '' : category.name }
					label={intl.formatMessage({ id : 'category.editor.fields.name.title' })}
					fullWidth
					onChange={event => setName(event.target.value) }
				/>

				{ error && <Alert severity="error" ><FormattedMessage id="categories.messages.error.saving" /></Alert> }
			</DialogContent>
		</Dialog>
	);
};

export default CategoryEditor;
