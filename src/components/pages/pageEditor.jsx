import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import { FormControl, InputLabel } from "@material-ui/core";
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { TextField } from 'formik-material-ui';
import Grid from "@material-ui/core/Grid";
import { libraryService } from '../../services';
import ImageUpload from '../imageUpload';
import StatusDropDown from '../statusDropDown';
import EditorDialog from '../editorDialog';
import SubmitButton from '../submitButton';
import WritersDropDown from '../account/writersDropdown';

const PageEditor = ({ show, page, pageNumber, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedPage, setSavedPage] = useState(null);
	const [newCover, setNewCover] = useState(null);

	const initialValues = {
		sequenceNumber: pageNumber + 1,
		text: '',
		status: 'Available',
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
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}

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
				.then((res) => {
					if (newCover && res.links && res.links.image_upload) {
						return uploadImage(res.links.image_upload);
					}

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

	const handleImageUpload = (file) => {
		if (file) {
			setNewCover(file);
		}
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
				enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' })
			})
			.catch((e) => {
				enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' })
			})
			.finally(() => setBusy(false));
	};

	const title = page === null
		? intl.formatMessage({ id: 'page.editor.header.add' })
		: intl.formatMessage({ id: 'page.editor.header.edit' }, { sequenceNumber: page.sequenceNumber });

	return (
		<EditorDialog show={show} busy={busy} title={title} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedPage || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting, values, setFieldValue }) => (
					<Form>
						<Grid container spacing={3}>
							<Grid item md={6} >
								<Field component={TextField} autoFocus name="sequenceNumber" type="number" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="page.editor.fields.sequenceNumber.title" />} error={errors.sequenceNumber && touched.sequenceNumber}
								/>
								<FormControl variant="outlined" margin="normal" fullWidth error={errors.status && touched.status}>
									<InputLabel ><FormattedMessage id="page.editor.fields.status.title" /></InputLabel>
									<StatusDropDown name="status" as="select" error={errors.status && touched.status} />
								</FormControl>
								<FormControl variant="outlined" margin="normal" fullWidth>
									<WritersDropDown name="accountId" variant="outlined"
										error={errors.accountId && touched.accountId}
										label={intl.formatMessage({ id: "page.editor.fields.accountId.title" })}
										value={values.accountId ? { id: values.accountId, accountName: `${values.accountName}` } : null}
										onWriterSelected={(selectedWriter) => {
											setFieldValue("accountId", selectedWriter !== null ? selectedWriter.id : initialValues.accountId);
											setFieldValue("accountName", selectedWriter !== null ? `${selectedWriter.accountName}` : initialValues.accountName);
										}} />
								</FormControl>
							</Grid>
							<Grid item md={6} >
								<FormControl variant="outlined" margin="normal" fullWidth>
									<ImageUpload imageUrl={savedPage && savedPage.links ? savedPage.links.image : null} defaultImage='/images/page_placeholder.jpg'
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

export default PageEditor;
