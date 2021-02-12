import React, { useEffect, useState, useStyle } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { DropzoneArea } from "material-ui-dropzone";
import { FormControl, InputLabel } from "@material-ui/core";
import { TextField, CheckboxWithLabel } from 'formik-material-ui';

import AuthorDropDown from "../authors/authorDropdown";
import SeriesDropDown from "../series/seriesDropdown";
import LanguageDropDown from '../languageDropDown';
import CopyrightDropDown from "../copyrightDropDown";
import CategoriesDropDown from "../categories/categoriesDropdown";
import SubmitButton from "../submitButton";
import EditorDialog from '../editorDialog';
import { libraryService } from "../../services";

const BookEditor = ({ show, book, createLink, onSaved, onCancelled }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [savedBook, setSavedBook] = useState();

	const initialValues = {
		title: '',
		description: '',
		yearPublished: new Date().getFullYear(),
		authorId: null,
		authorName: '',
		seriesId: null,
		seriesName: '',
		seriesIndex: null,
		copyrights: 0,
		language: 'en',
		isPublic: false,
		categories: []
	};

	useEffect(() => {
		setSavedBook(book);
	}, [book]);

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.name.error' })),
		description: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.description.error' })),
		authorId: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.author.error' })),
		language: Yup.string()
			.required(intl.formatMessage({ id: 'book.editor.fields.language.error' }))
	});

	function onSubmit(fields) {
		setBusy(true);
		if (fields.categories && fields.categories.length > 0) {
			fields.categories = fields.categories.map((c) => ({ id: c.id }));
		}

		if (book === null && createLink !== null) {
			libraryService
				.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (book !== null) {
			libraryService
				.put(book.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
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
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	};


	const dialogTitle =
		book === null
			? intl.formatMessage({ id: "book.editor.header.add" })
			: intl.formatMessage(
				{ id: "book.editor.header.edit" },
				{ title: book.title }
			);

	return (
		<EditorDialog show={show} busy={busy} title={dialogTitle} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedBook || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
				{({ errors, touched, isSubmitting, values, setFieldValue }) => (
					<Form>
						<Field component={TextField} autoFocus name="title" type="text" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="book.editor.fields.name.title" />} error={errors.title && touched.title}
						/>
						<Field component={TextField} name="description" type="text" variant="outlined" margin="normal" fullWidth
							multiline rows={5}
							label={<FormattedMessage id="book.editor.fields.description.title" />} error={errors.description && touched.description}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.authorId && touched.authorId}>
							<InputLabel><FormattedMessage id="book.editor.fields.author.title" /></InputLabel>
							<AuthorDropDown name="authorId" error={errors.authorId && touched.authorId}
								defaultValue={{ id: values.authorId, name: values.authorName }}
								onAuthorSelected={(selectedAuthor) => {
									setFieldValue(
										"authorId",
										selectedAuthor !== null ? selectedAuthor : initialValues.authorId
									);
								}} />
						</FormControl>
						<Field component={CheckboxWithLabel} type="checkbox" id="isPublic" name="isPublic" margin="normal"
							Label={{ label: intl.formatMessage({ id: "book.editor.fields.public" }) }}
							error={errors.isPublic && touched.isPublic}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.authorId && touched.authorId}>
							<InputLabel><FormattedMessage id="book.editor.fields.categories.title" /></InputLabel>
							<CategoriesDropDown name="categories" error={errors.categories && touched.categories}
								defaultValue={values.categories}
								onCategoriesSelected={(selectedCategories) => {
									setFieldValue(
										"categories",
										selectedCategories !== null ? selectedCategories : initialValues.categories
									);
								}} />
						</FormControl>
						<Field component={TextField} name="yearPublished" type="number" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="book.editor.fields.yearPublished.title" />} error={errors.yearPublished && touched.yearPublished}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.language && touched.language}>
							<InputLabel ><FormattedMessage id="book.editor.fields.language.title" /></InputLabel>
							<LanguageDropDown name="language" as="select" error={errors.language && touched.language} />
						</FormControl>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.seriesId && touched.seriesId}>
							<InputLabel><FormattedMessage id="book.editor.fields.series.title" /></InputLabel>
							<SeriesDropDown fullWidth id="seriesId" error={errors.seriesId && touched.seriesId}
								defaultValue={{ id: values.seriesId, name: values.seriesName }}
								onSeriesSelected={(selectedSeries) => {
									setFieldValue(
										"seriesId",
										selectedSeries !== null ? selectedSeries : initialValues.authorId
									);
								}} />
						</FormControl>
						<Field component={TextField} name="seriesIndex" type="number" variant="outlined" margin="normal" fullWidth
							label={<FormattedMessage id="book.editor.fields.seriesIndex.title" />} error={errors.seriesIndex && touched.seriesIndex}
						/>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.copyrights && touched.copyrights}>
							<InputLabel ><FormattedMessage id="book.editor.fields.copyrights.title" /></InputLabel>
							<CopyrightDropDown name="copyrights" as="select" error={errors.copyrights && touched.copyrights} />
						</FormControl>
						{book && book.links && book.links.image_upload && (
							<DropzoneArea
								onChange={(files) => handleImageUpload(files)}
								filesLimit={1}
								acceptedFiles={["image/*"]}
								dropzoneText={intl.formatMessage({
									id: "message.image.upload",
								})}
							/>
						)}
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog >
	);
};

export default BookEditor;
