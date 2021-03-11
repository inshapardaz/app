import React, { useEffect, useState, useStyle } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { DropzoneArea } from "material-ui-dropzone";
import { FormControl, InputLabel, Grid } from "@material-ui/core";
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import AuthorDropDown from "../authors/authorDropdown";
import SeriesDropDown from "../series/seriesDropdown";
import LanguageDropDown from '../languageDropDown';
import CopyrightDropDown from "../copyrightDropDown";
import CategoriesDropDown from "../categories/categoriesDropdown";
import SubmitButton from "../submitButton";
import { libraryService } from "../../services";

const BookEditorForm = ({ book, createLink, onBusy, onSaved }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedBook, setSavedBook] = useState();
	const selectedLibrary = libraryService.getSelectedLibrary();

	const initialValues = {
		title: '',
		description: '',
		yearPublished: '',
		authorId: '',
		authorName: '',
		seriesId: '',
		seriesName: '',
		seriesIndex: '',
		copyrights: "Copyright",
		language: selectedLibrary != null ? selectedLibrary.language : 'en',
		isPublic: false,
		status: "AvailableForTyping",
		categories: []
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.name.error' })),
		authorId: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.author.error' })),
		language: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.language.error' }))
	});

	useEffect(() => {
		setSavedBook(book);
	}, [book]);

	function onSubmit(fields) {
		setBusy(true);
		onBusy && onBusy(true);
		const data = { ...fields };
		if (data.categories && data.categories.length > 0) {
			data.categories = data.categories.map((c) => ({ id: c.id }));
		}
		else {
			data.categories = null;
		}

		if (book === null && createLink !== null) {
			libraryService
				.post(createLink, data)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
					if (onSaved) onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (book !== null) {
			libraryService
				.put(book.links.update, data)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
					if (onSaved) onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		onBusy && onBusy(false);
		setBusy(false);
	}

	const handleImageUpload = (files) => {
		if (files.length < 1) {
			return;
		}

		setBusy(true);
		if (book && book.links.image_upload !== null) {
			libraryService.upload(book.links.image_upload, files[0])
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
					if (onSaved) onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	};

	const canUpload = () => book && book.links && book.links.image_upload;

	return (<Formik initialValues={savedBook || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
		{({ errors, touched, isSubmitting, values, setFieldValue }) => (
			<Form>
				<Grid container spacing={3}>
					<Grid item md={canUpload() ? 6 : 12} >
						<Field component={TextField} autoFocus name="title" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="book.editor.fields.name.title" />} error={errors.title && touched.title}
						/>
						<Field component={TextField} name="description" type="text" variant="outlined" margin="normal" fullWidth
							multiline rows={5}
							label={<FormattedMessage id="book.editor.fields.description.title" />} error={errors.description && touched.description}
						/>
						<FormControl margin="normal" fullWidth>
							<AuthorDropDown name="authorId" variant="outlined"
								error={errors.authorId && touched.authorId}
								label={intl.formatMessage({ id: "book.editor.fields.author.title" })}
								value={values.authorId ? { id: values.authorId, name: values.authorName } : null}
								onAuthorSelected={(selectedAuthor) => {
									setFieldValue("authorId", selectedAuthor !== null ? selectedAuthor.id : initialValues.authorId);
									setFieldValue("authorName", selectedAuthor !== null ? selectedAuthor.name : initialValues.authorName);
								}} />
						</FormControl>
						<Field component={CheckboxWithLabel} type="checkbox" id="isPublic" name="isPublic" margin="normal"
							Label={{ label: intl.formatMessage({ id: "book.editor.fields.public" }) }}
							error={errors.isPublic && touched.isPublic}
						/>
					</Grid>
					{canUpload() && (
						<Grid item md={6}>
							<DropzoneArea
								onChange={(files) => handleImageUpload(files)}
								filesLimit={1}
								acceptedFiles={["image/*"]}
								dropzoneText={intl.formatMessage({
									id: "message.image.upload",
								})}
							/>
						</Grid>
					)}
				</Grid>
				<Grid container spacing={3} >
					<Grid item md={6}>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.categories && touched.categories}>
							<CategoriesDropDown name="categories" error={errors.categories && touched.categories}
								label={intl.formatMessage({ id: "book.editor.fields.categories.title" })}
								value={values.categories}
								onCategoriesSelected={(selectedCategories) => {
									setFieldValue(
										"categories",
										selectedCategories !== null ? selectedCategories : initialValues.categories
									);
								}} />
						</FormControl>
						<Field component={TextField} name="yearPublished" type="number" variant="outlined" margin="normal" fullWidth
							label={intl.formatMessage({ id: "book.editor.fields.yearPublished.title" })}
							error={errors.yearPublished && touched.yearPublished}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.language && touched.language}>
							<LanguageDropDown name="language" as="select"
								label={intl.formatMessage({ id: "book.editor.fields.language.title" })}
								error={errors.language && touched.language} />
						</FormControl>
					</Grid>
					<Grid item md={6}>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.seriesId && touched.seriesId}>
							<SeriesDropDown fullWidth id="seriesId" error={errors.seriesId && touched.seriesId}
								label={intl.formatMessage({ id: "book.editor.fields.series.title" })}
								value={values.seriesId ? { id: values.seriesId, name: values.seriesName } : null}
								onSeriesSelected={(selectedSeries) => {
									setFieldValue("seriesId", selectedSeries !== null ? selectedSeries.id : initialValues.seriesId);
									setFieldValue("seriesName", selectedSeries !== null ? selectedSeries.name : initialValues.seriesName);
								}} />
						</FormControl>
						<Field component={TextField} name="seriesIndex" type="number" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="book.editor.fields.seriesIndex.title" />}
							error={errors.seriesIndex && touched.seriesIndex}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.copyrights && touched.copyrights}
							label={intl.formatMessage({ id: "book.editor.fields.copyrights.title" })}
						>
							<CopyrightDropDown name="copyrights" as="select" error={errors.copyrights && touched.copyrights} />
						</FormControl>
					</Grid>
				</Grid>

				<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
			</Form>
		)}
	</Formik>);
};

export default BookEditorForm;
