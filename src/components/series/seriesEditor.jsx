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

const SeriesEditor = ({ show, series, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [newCover, setNewCover] = useState(null);
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
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}
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
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}

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
				enqueueSnackbar(intl.formatMessage({ id: 'series.messages.saved' }), { variant: 'success' })
			})
			.catch((e) => {
				enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.saving' }), { variant: 'error' })
			})
			.finally(() => setBusy(false));
	};

	const handleImageUpload = (file) => {
		if (file) {
			setNewCover(file);
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
						<Grid container spacing={3}>
							<Grid item md={6} >
								<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="series.editor.fields.name.title" />} error={errors.name && touched.name}
								/>
								<Field component={TextField} name="description" type="text" variant="outlined" margin="normal" fullWidth
									multiline rows={5}
									label={<FormattedMessage id="series.editor.fields.description.title" />} error={errors.description && touched.description}
								/>

							</Grid>

							<Grid item md={6} >
								<FormControl variant="outlined" margin="normal" fullWidth>
									<ImageUpload imageUrl={savedSeries && savedSeries.links ? savedSeries.links.image : null} defaultImage='/images/series_placeholder.jpg'
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

export default SeriesEditor;
