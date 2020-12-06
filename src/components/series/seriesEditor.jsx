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
import { libraryService } from '../../services';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const SeriesEditor = ({ show, series, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const handleSave = () => {
		setBusy(true);

		if (series === null && createLink !== null) {
			let obj = { name, description };
			libraryService.post(createLink, obj)
				.then(() => onSaved())
				.catch(() => setError(true))
				.finally(() => setBusy(false));
		}
		else if (series !== null) {
			let obj = { ...series };
			obj.name = name;
			obj.description = description;
			libraryService.put(series.links.update, obj)
				.then(() => onSaved())
				.catch(() => setError(true))
				.finally(() => setBusy(false));
		}
	};

	const handleImageUpload = (files) => {
		if (files.length < 1) {
			return;
		}

		if (series && series.links.image_upload !== null) {
			libraryService.upload(series.links.image_upload, files[0])
				.then(() => onSaved())
				.catch(() => setError(true))
				.finally(() => setBusy(false));
		}
	};

	const classes = useStyles();
	const title = series === null
		? intl.formatMessage({ id: 'series.editor.header.add' })
		: intl.formatMessage({ id: 'series.editor.header.edit' }, { name: series.title });

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
					defaultValue={series === null ? '' : series.name}
					label={intl.formatMessage({ id: 'category.editor.fields.name.title' })}
					fullWidth
					onChange={event => setName(event.target.value)}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="description"
					defaultValue={series === null ? '' : series.description}
					label={intl.formatMessage({ id: 'category.editor.fields.description.title' })}
					fullWidth
					onChange={event => setDescription(event.target.value)}
				/>

				{
					series && series.links.image_upload &&
					<DropzoneArea onChange={files => handleImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
				}
				{error && <Alert severity="error" ><FormattedMessage id="categories.messages.error.saving" /></Alert>}
			</DialogContent>
		</Dialog>
	);
};

export default SeriesEditor;
