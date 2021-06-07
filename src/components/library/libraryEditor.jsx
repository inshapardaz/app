import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Button, FormControl, InputLabel } from "@material-ui/core";
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import ColorPicker from 'material-ui-color-picker'
import EditorDialog from '../editorDialog';
import { libraryService } from "../../services";
import LanguageDropDown from '../languageDropDown';
import SubmitButton from "../submitButton";

const LibraryEditor = ({ show, library, createLink, onSaved, onCancelled }) => {
	const { enqueueSnackbar } = useSnackbar();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [savedLibrary, setSavedLibrary] = useState();

	const initialValues = {
		name: '',
		language: 'en',
		supportsPeriodicals: false
	};

	useEffect(() => {
		setSavedLibrary(library);
	}, [library]);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'library.name.error.required' })),
		language: Yup.string()
			.required(intl.formatMessage({ id: 'library.language.error.required' })),
		primaryColor: Yup.string(),
		secondaryColor: Yup.string()
	});

	function onSubmit(fields) {
		setBusy(true);
		if (library === null && createLink !== null) {
			libraryService
				.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' })
					onSaved();
				})
				.catch((e) => {
					console.error(e);
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (library !== null) {
			libraryService
				.put(library.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' })
					onSaved();
				})
				.catch((e) => {
					console.error(e);
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		setBusy(false);
	}

	const dialogTitle =
		library === null
			? intl.formatMessage({ id: "library.editor.header.add" })
			: intl.formatMessage(
				{ id: "library.editor.header.edit" },
				{ name: library.name }
			);

	return (
		<EditorDialog show={show} busy={busy} title={dialogTitle} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedLibrary || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting, values, setFieldValue }) => (
					<Form>
						<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="library.name.label" />} error={errors.name && touched.name}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth>
							<InputLabel id="library_lang"><FormattedMessage id="library.language.label" /></InputLabel>
							<LanguageDropDown name="language" labelId="library_lang"
								error={errors.language && touched.language} />
						</FormControl>
						<FormControl variant="outlined" margin="normal" fullWidth >
							<Field
								component={ColorPicker}
								defaultValue='#373837'
								value={values.primaryColor}
								onChange={color => setFieldValue("primaryColor", color)}
								label={intl.formatMessage({ id: "library.primaryColor.label" })}
								error={errors.primaryColor && touched.primaryColor}
							/>
						</FormControl>
						<FormControl variant="outlined" margin="normal" fullWidth >
							<Field
								component={ColorPicker}
								defaultValue='#848484'
								value={values.secondaryColor}
								onChange={color => setFieldValue("secondaryColor", color)}
								label={intl.formatMessage({ id: "library.secondaryColor.label" })}
								error={errors.secondaryColor && touched.secondaryColor}
							/>
						</FormControl>
						<Field
							component={CheckboxWithLabel}
							type="checkbox"
							id="supportsPeriodicals" name="supportsPeriodicals" margin="normal"
							Label={{ label: intl.formatMessage({ id: "library.supportsPeriodical.label" }) }}
							error={errors.supportsPeriodicals && touched.supportsPeriodicals}
						/>
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default LibraryEditor;
