import React, { useEffect, useState, useStyle } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { DropzoneArea } from "material-ui-dropzone";
import ImageUpload from '../imageUpload';
import { FormControl, InputLabel, Grid } from "@material-ui/core";
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import AuthorDropDown from "../authors/authorDropdown";
import SeriesDropDown from "../series/seriesDropdown";
import LanguageDropDown from '../languageDropDown';
import CopyrightDropDown from "../copyrightDropDown";
import CategoriesDropDown from "../categories/categoriesDropdown";
import SubmitButton from "../submitButton";
import { libraryService } from "../../services";
import BookStatusDropDown from "./bookStatusDropDown";

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

const BookEditorForm = ({ book, createLink, onBusy, onSaved }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [newCover, setNewCover] = useState(null);
	const [savedBook, setSavedBook] = useState();

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

		if (data.yearPublished === '') data.yearPublished = null;
		if (data.seriesId === '') data.seriesId = null;
		if (data.seriesIndex === '') data.seriesIndex = null;

		if (data.categories && data.categories.length > 0) {
			data.categories = data.categories.map((c) => ({ id: c.id }));
		}
		else {
			data.categories = null;
		}

		if (book === null && createLink !== null) {
			libraryService
				.post(createLink, data)
				.then((res) => {
					if (onSaved) onSaved();
					if (newCover) {
						return uploadImage(res);
					}
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
				})
				.catch((e) => {
					console.log('error creating book');
					console.dir(e)
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (book !== null) {
			libraryService
				.put(book.links.update, data)
				.then(() => {
					if (onSaved) onSaved();
					if (newCover) {
						return uploadImage(book);
					}
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
				})
				.catch((e) => {
					console.log('error updating book');
					console.dir(e)
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	}

	const uploadImage = (response) => {
		if (!response || !response.links || !response.links.image_upload) {
			return;
		}

		setBusy(true);
		libraryService.upload(response.links.image_upload, newCover)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
				if (onSaved) onSaved();
			})
			.catch((e) => {
				console.log('error saving image');
				console.dir(e)
				enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
			})
			.finally(() => setBusy(false));
	}

	const handleImageUpload = (file) => {
		if (file) {
			setNewCover(file);
		}
	};

	return (<Formik initialValues={savedBook || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
		{({ errors, touched, isSubmitting, values, setFieldValue }) => (
			<Form>
				<Grid container spacing={3}>
					<Grid item md={6} >
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
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.status && touched.status}>
							<BookStatusDropDown name="status" as="select"
								label={intl.formatMessage({ id: "book.editor.fields.status.title" })}
								error={errors.status && touched.status} />
						</FormControl>
					</Grid>
					<Grid item md={6}>
						<FormControl variant="outlined" margin="normal" fullWidth>
							<ImageUpload imageUrl={savedBook && savedBook.links ? savedBook.links.image : null} defaultImage='/images/book_placeholder.jpg'
								onImageSelected={handleImageUpload}
								height="420" />
						</FormControl>
					</Grid>
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
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.copyrights && touched.copyrights}>
							<CopyrightDropDown name="copyrights" as="select" error={errors.copyrights && touched.copyrights}
								label={intl.formatMessage({ id: "book.editor.fields.copyrights.title" })} />
						</FormControl>
					</Grid>
				</Grid>

				<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
			</Form>
		)}
	</Formik>);
};

export default BookEditorForm;
