import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import { FormControl, InputLabel } from "@material-ui/core";
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { TextField } from 'formik-material-ui';
import { DropzoneArea } from 'material-ui-dropzone';
import { libraryService } from '../../services';
import StatusDropDown from '../statusDropDown';
import EditorDialog from '../editorDialog';
import SubmitButton from '../submitButton';
import WritersDropDown from '../account/writersDropdown';

const PageEditor = ({ show, page, pageNumber, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedPage, setSavedPage] = useState(null);

	const initialValues = {
		sequenceNumber: pageNumber + 1,
		text: '',
		status: 0,
		accountId: null
	};

	useEffect(() => {
		setSavedPage(page);
	}, [page]);

	const validationSchema = Yup.object().shape({
		sequenceNumber: Yup.string()
			.required(intl.formatMessage({ id: 'page.editor.fields.sequenceNumber.error' }))
	});

	const onSubmit = (fields) => {
		setBusy(true);
		if (page === null && createLink !== null) {
			libraryService.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (page !== null) {
			libraryService.put(page.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}

		setBusy(false)
	};

	const onImageUpload = (files) => {
		if (files.length < 1) {
			return;
		}

		if (page && page.links.image_upload !== null) {
			libraryService.upload(page.links.image_upload, files[0])
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	};

	const title = page === null
		? intl.formatMessage({ id: 'page.editor.header.add' })
		: intl.formatMessage({ id: 'page.editor.header.edit' }, { sequenceNumber: page.sequenceNumber });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedPage || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting, values, setFieldValue }) => (
					<Form>
						<Field component={TextField} autoFocus name="sequenceNumber" type="number" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="page.editor.fields.sequenceNumber.title" />} error={errors.sequenceNumber && touched.sequenceNumber}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.status && touched.status}>
							<InputLabel ><FormattedMessage id="page.editor.fields.status.title" /></InputLabel>
							<StatusDropDown name="status" as="select" error={errors.status && touched.status} />
						</FormControl>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.accountId && touched.accountId}>
							<InputLabel><FormattedMessage id="page.editor.fields.accountId.title" /></InputLabel>
							<WritersDropDown name="accountId" error={errors.accountId && touched.accountId}
								label={intl.formatMessage({ id: "page.editor.fields.accountId.title" })}
								onWriterSelected={(selectedWriter) => {
									setFieldValue(
										"accountId",
										selectedWriter !== null ? selectedWriter : initialValues.accountId
									);
								}} />
						</FormControl>
						{
							page && page.links.image_upload &&
							<DropzoneArea onChange={files => onImageUpload(files)} filesLimit={1} acceptedFiles={['image/*']} />
						}
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default PageEditor;
