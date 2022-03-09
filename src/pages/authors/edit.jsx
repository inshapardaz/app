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
import { TextField } from 'formik-mui';

// Local Imports
import ImageUpload from '@/components/imageUpload';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';
import { libraryService } from '@/services';

const AuhtorEditPage = () => {
  const { authorId } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [author, setAuthor] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const library = useSelector((state) => state.libraryReducer.library);

  const initialValues = {
    name: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(intl.formatMessage({ id: 'author.editor.fields.name.error' })),
  });

  useEffect(() => {
    if (authorId && library) {
      setBusy(true);
      libraryService.getAuthorById(library.id, authorId)
        .then((res) => setAuthor(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [authorId, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = (setSubmitting) => {
    setSubmitting(false);
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.saving' }), { variant: 'error' });
  };

  const showSuccess = (setSubmitting) => {
    setBusy(false);
    setSubmitting(false);
    enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.saved' }), { variant: 'success' });
    history.goBack();
  };

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    if (author) {
      libraryService.updateAuthor(author.links.update, fields)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        }, () => showError(setSubmitting));
    } else {
      libraryService.createAuthor(library.links.create_author, fields)
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

  const title = author ? intl.formatMessage({ id: 'author.editor.header.edit' }, { name: author.name }) : intl.formatMessage({ id: 'author.editor.header.add' });

  return (
    <div data-ft="edit-author-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={author || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({
            errors, touched,
          }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <Field
                    component={TextField}
                    autoFocus
                    name="name"
                    type="name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="author.editor.fields.name.title" />}
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
                    rows={12}
                    label={<FormattedMessage id="author.editor.fields.name.description.title" />}
                    error={errors.description && touched.description}
                  />
                </Grid>

                <Grid item md={6}>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <ImageUpload
                      imageUrl={author && author.links ? author.links.image : null}
                      defaultImage="/images/author_placeholder.jpg"
                      onImageSelected={handleImageUpload}
                      height="450"
                    />
                  </FormControl>

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
              </Grid>
            </Form>
          )}
        </Formik>
      </CenteredContent>
    </div>
  );
};

export default AuhtorEditPage;
