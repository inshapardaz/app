import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { TextField } from 'formik-material-ui';
import EditorDialog from '../editorDialog';
import SubmitButton from '../submitButton';
import { libraryService } from '../../services';

const CategoryEditor = ({ show, category, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedCategory, setSavedCategory] = useState(null);

	const initialValues = {
		name: ''
	};

	useEffect(() => {
		setSavedCategory(category);
	}, [category]);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'category.editor.fields.name.error' }))
	});

	const onSubmit = (fields) => {
		setBusy(true);
		if (category === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (category !== null) {
			libraryService.put(category.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}

		setBusy(false)
	};

	const title = category === null ?
		intl.formatMessage({ id: 'categories.action.create' }) :
		intl.formatMessage({ id: 'category.editor.header.edit' }, { name: category.name });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedCategory || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="category.editor.fields.name.title" />} error={errors.name && touched.name}
						/>
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default CategoryEditor;
