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

const ChapterEditor = ({ show, chapter, chapterCount, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedChapter, setSavedChapter] = useState(null);

	const initialValues = {
		title: '',
		chapterNumber: chapterCount + 1
	};

	useEffect(() => {
		setSavedChapter(chapter);
	}, [chapter]);

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.required(intl.formatMessage({ id: 'chapter.editor.fields.name.error' }))
	});

	const onSubmit = (fields) => {
		setBusy(true);
		if (chapter === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (chapter !== null) {
			libraryService.put(chapter.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}

		setBusy(false)
	};

	const title = chapter === null
		? intl.formatMessage({ id: 'chapter.editor.header.add' })
		: intl.formatMessage({ id: 'chapter.editor.header.edit' }, { title: chapter.title });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedChapter || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Field component={TextField} autoFocus name="title" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="chapter.editor.fields.name.title" />} error={errors.title && touched.title}
						/>
						<Field component={TextField} name="chapterNumber" type="number" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="chapter.editor.fields.number.title" />} error={errors.chapterNumber && touched.chapterNumber}
						/>
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default ChapterEditor;
