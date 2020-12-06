import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { TextField } from 'formik-material-ui';
import { DropzoneArea } from 'material-ui-dropzone';
import { libraryService } from '../../services';
import EditorDialog from '../editorDialog';
import SubmitButton from '../submitButton';

const AuthorEditor = ({ show, author, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

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
		console.log('saving');
		setBusy(true);
		if (author === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then(() => {
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
				.then(() => {
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

	const onImageUpload = (files) => {
		if (files.length < 1) {
			return;
		}

		if (author && author.links.image_upload !== null) {
			libraryService.upload(author.links.image_upload, files[0])
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
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
						<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="library.name.label" />} error={errors.name && touched.name}
						/>
						{
							author && author.links.image_upload &&
							<DropzoneArea onChange={files => onImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
						}
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default AuthorEditor;
