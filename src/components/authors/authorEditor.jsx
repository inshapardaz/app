import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { TextField } from 'formik-material-ui';
import { FormControl, Grid } from "@material-ui/core";
import ImageUpload from '../imageUpload';
import { libraryService } from '../../services';
import EditorDialog from '../editorDialog';
import SubmitButton from '../submitButton';

const AuthorEditor = ({ show, author, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [newCover, setNewCover] = useState(null);
	const [busy, setBusy] = useState(false);
	const [savedAuthor, setSavedAuthor] = useState(null);

	const initialValues = {
		name: ''
	};

	useEffect(() => {
		setSavedAuthor(author);
	}, [author]);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'author.editor.fields.name.error' }))
	});

	const onSubmit = (fields) => {
		setBusy(true);
		if (author === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}

					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (author !== null) {
			libraryService.put(author.links.update, fields)
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}

					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}

		setBusy(false)
	};

	const uploadImage = (uploadLink) => {
		setBusy(true);

		if (!uploadLink) {
			setBusy(false);
			if (onSaved) onSaved();
			return;
		}

		libraryService.upload(uploadLink, newCover)
			.then(() => {
				if (onSaved) onSaved();
				enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.saved' }), { variant: 'success' })
			})
			.catch((e) => {
				enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.saving' }), { variant: 'error' })
			})
			.finally(() => setBusy(false));
	};

	const handleImageUpload = (file) => {
		if (file) {
			setNewCover(file);
		}
	};

	const title = author === null
		? intl.formatMessage({ id: 'author.editor.header.add' })
		: intl.formatMessage({ id: 'author.editor.header.edit' }, { name: author.name });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedAuthor || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Grid container spacing={3}>
							<Grid item md={6} >
								<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="library.name.label" />} error={errors.name && touched.name}
								/>
							</Grid>
							<Grid item md={6} >
								<FormControl variant="outlined" margin="normal" fullWidth>
									<ImageUpload imageUrl={savedAuthor && savedAuthor.links ? savedAuthor.links.image : null} defaultImage='/images/author_placeholder.jpg'
										onImageSelected={handleImageUpload}
										height="420" />
								</FormControl>
							</Grid>
						</Grid>
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default AuthorEditor;
