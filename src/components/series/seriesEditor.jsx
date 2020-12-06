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

const SeriesEditor = ({ show, series, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedSeries, setSavedSeries] = useState(null);

	const initialValues = {
		name: '',
		description: ''
	};

	useEffect(() => {
		setSavedSeries(series);
	}, [series]);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'series.editor.fields.name.error' }))
	});

	const onSubmit = (fields) => {
		setBusy(true);
		if (series === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (series !== null) {
			libraryService.put(series.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}

		setBusy(false)
	};

	const onImageUpload = (files) => {
		if (files.length < 1) {
			return;
		}

		if (series && series.links.image_upload !== null) {
			libraryService.upload(series.links.image_upload, files[0])
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	};

	const title = series === null
		? intl.formatMessage({ id: 'series.editor.header.add' })
		: intl.formatMessage({ id: 'series.editor.header.edit' }, { name: series.name });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedSeries || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="series.editor.fields.name.title" />} error={errors.name && touched.name}
						/>
						<Field component={TextField} name="description" type="text" variant="outlined" margin="normal" fullWidth
							multiline rows={5}
							label={<FormattedMessage id="series.editor.fields.description.title" />} error={errors.description && touched.description}
						/>
						{
							series && series.links.image_upload &&
							<DropzoneArea onChange={files => onImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
						}
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default SeriesEditor;
