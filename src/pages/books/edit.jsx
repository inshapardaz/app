import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// MUI
import { Button, Grid, FormControl } from '@mui/material';

// Formik
import {
  Formik, Field, Form,
} from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-mui';

// Local Imports
import { libraryService } from '@/services/';
import ImageUpload from '@/components/imageUpload';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';
import AuthorDropDown from '@/components/authors/authorDropDown';
import BookStatusDropDown from '@/components/books/bookStatusDropDown';
import LanguageDropDown from '@/components/language/languageDropDown';
import CategoriesDropDown from '@/components/categories/categoriesDropDown';
import CopyrightDropDown from '@/components/copyrightDropDown';
import SeriesDropDown from '@/components/series/seriesDropDown';

const BookEditPage = () => {
  const { bookId } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [book, setBook] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const library = useSelector((state) => state.libraryReducer.library);

  const initialValues = {
    title: '',
    description: '',
    yearPublished: '',
    authors: [],
    seriesId: '',
    seriesName: '',
    seriesIndex: '',
    copyrights: 'Copyright',
    language: library != null ? library.language : 'en',
    isPublic: false,
    status: 'AvailableForTyping',
    categories: [],
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(intl.formatMessage({ id: 'book.editor.fields.name.error' })),
    authorId: Yup.array()
      .min(1, intl.formatMessage({ id: 'book.editor.fields.author.error' })),
    // .required(intl.formatMessage({ id: 'book.editor.fields.author.error' })),
    language: Yup.string()
      .required(intl.formatMessage({ id: 'book.editor.fields.language.error' })),
  });

  useEffect(() => {
    if (bookId && library) {
      setBusy(true);
      libraryService.getBookById(library.id, bookId)
        .then((res) => setBook(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [bookId, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = (setSubmitting) => {
    setSubmitting(false);
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' });
  };

  const showSuccess = (setSubmitting) => {
    setBusy(false);
    setSubmitting(false);
    enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' });
    history.goBack();
  };

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    const data = { ...fields };

    if (data.yearPublished === '') data.yearPublished = null;
    if (data.seriesId === '') data.seriesId = null;
    if (data.seriesIndex === '') data.seriesIndex = null;

    if (data.authors && data.authors.length > 0) {
      data.authors = data.authors.map((c) => ({ id: c.id }));
    } else {
      data.authors = null;
    }

    if (data.categories && data.categories.length > 0) {
      data.categories = data.categories.map((c) => ({ id: c.id }));
    } else {
      data.categories = null;
    }
    if (book) {
      libraryService.updateBook(book.links.update, data)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        }, () => showError(setSubmitting));
    } else {
      libraryService.createBook(library.links.create_book, data)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        }, () => showError(setSubmitting));
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      setNewCover(file);
    }
  };

  const title = book ? intl.formatMessage({ id: 'book.editor.header.edit' }, { title: book.title }) : intl.formatMessage({ id: 'book.editor.header.add' });

  return (
    <div data-ft="edit-book-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={book || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({
            errors, touched, values, setFieldValue,
          }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <Field
                    component={TextField}
                    autoFocus
                    name="title"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="book.editor.fields.name.title" />}
                    error={errors.name && touched.name}
                  />
                  <Field
                    component={TextField}
                    name="description"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={5}
                    label={<FormattedMessage id="book.editor.fields.description.title" />}
                    error={errors.description && touched.description}
                  />
                  <FormControl margin="normal" fullWidth>
                    <AuthorDropDown
                      name="authorId"
                      variant="outlined"
                      error={errors.authorId && touched.authorId}
                      label={intl.formatMessage({ id: 'book.editor.fields.author.title' })}
                      value={values.authors}
                      onAuthorSelected={(authors) => {
                        setFieldValue(
                          'authors',
                          authors !== null ? authors : initialValues.authors,
                        );
                      }}
                    />
                  </FormControl>
                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    margin="normal"
                    Label={{ label: intl.formatMessage({ id: 'book.editor.fields.public' }) }}
                    error={errors.isPublic && touched.isPublic}
                  />
                  <FormControl variant="outlined" margin="normal" fullWidth error={errors.categories && touched.categories}>
                    <CategoriesDropDown
                      name="categories"
                      error={errors.categories && touched.categories}
                      label={intl.formatMessage({ id: 'book.editor.fields.categories.title' })}
                      value={values.categories}
                      onCategoriesSelected={(cat) => {
                        setFieldValue(
                          'categories',
                          cat !== null ? cat : initialValues.categories,
                        );
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6}>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <ImageUpload
                      imageUrl={book && book.links ? book.links.image : null}
                      defaultImage="/images/book_placeholder.jpg"
                      onImageSelected={handleImageUpload}
                      height="400"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <LanguageDropDown
                    name="language"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={intl.formatMessage({ id: 'book.editor.fields.language.title' })}
                    error={errors.language && touched.language}
                  />
                  <Field
                    component={TextField}
                    name="yearPublished"
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={intl.formatMessage({ id: 'book.editor.fields.yearPublished.title' })}
                    error={errors.yearPublished && touched.yearPublished}
                  />
                  <CopyrightDropDown
                    name="copyrights"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    error={errors.copyrights && touched.copyrights}
                    label={intl.formatMessage({ id: 'book.editor.fields.copyrights.title' })}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl variant="outlined" margin="normal" fullWidth error={errors.seriesId && touched.seriesId}>
                    <SeriesDropDown
                      fullWidth
                      id="seriesId"
                      error={errors.seriesId && touched.seriesId}
                      label={intl.formatMessage({ id: 'book.editor.fields.series.title' })}
                      value={values.seriesId ? { id: values.seriesId, name: values.seriesName } : null}
                      onSeriesSelected={(selectedSeries) => {
                        setFieldValue('seriesId', selectedSeries !== null ? selectedSeries.id : initialValues.seriesId);
                        setFieldValue('seriesName', selectedSeries !== null ? selectedSeries.name : initialValues.seriesName);
                      }}
                    />
                  </FormControl>
                  <Field
                    component={TextField}
                    name="seriesIndex"
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="book.editor.fields.seriesIndex.title" />}
                    error={errors.seriesIndex && touched.seriesIndex}
                  />
                  <BookStatusDropDown
                    name="status"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={intl.formatMessage({ id: 'book.editor.fields.status.title' })}
                    error={errors.status && touched.status}
                  />
                </Grid>
              </Grid>
              <Grid
                item
                container
                md={12}
                direction="row"
                justifyContent="space-evenly"
                sx={{ mb: (theme) => theme.spacing(2) }}
              >
                <Grid item md={3}>
                  <Button
                    id="submitButton"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    <FormattedMessage id="action.save" />
                  </Button>
                </Grid>
                <Grid item md={3}>
                  <Button
                    id="cancelButton"
                    variant="outlined"
                    fullWidth
                    onClick={() => history.goBack()}
                  >
                    <FormattedMessage id="action.cancel" />
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CenteredContent>
    </div>
  );
};

export default BookEditPage;
