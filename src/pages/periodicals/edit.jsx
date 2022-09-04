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
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-mui';

// Local Imports
import { libraryService } from '@/services/';
import ImageUpload from '@/components/imageUpload';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import Error from '@/components/error';
import CenteredContent from '@/components/layout/centeredContent';
import CategoriesDropDown from '@/components/categories/categoriesDropDown';
import FrequencyDropDown from '@/components/periodicals/frequencyDropDown';

const PeriodicalEditPage = () => {
  const { id } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [periodical, setPeriodical] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const library = useSelector((state) => state.libraryReducer.library);

  const initialValues = {
    title: '',
    description: '',
    frequency: 'Monthly',
    categories: [],
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(intl.formatMessage({ id: 'periodical.editor.fields.title.error' })),
  });

  useEffect(() => {
    if (id && library) {
      setBusy(true);
      libraryService.getPeriodicalById(library.id, id)
        .then((res) => setPeriodical(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [id, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = (setSubmitting) => {
    setSubmitting(false);
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'periodical.messages.error.saving' }), { variant: 'error' });
  };

  const showSuccess = (setSubmitting) => {
    setBusy(false);
    setSubmitting(false);
    enqueueSnackbar(intl.formatMessage({ id: 'periodical.messages.saved' }), { variant: 'success' });
    history.goBack();
  };

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    const data = { ...fields };

    if (data.categories && data.categories.length > 0) {
      data.categories = data.categories.map((c) => ({ id: c.id }));
    } else {
      data.categories = null;
    }

    if (periodical) {
      libraryService.updatePeriodical(periodical.links.update, data)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        })
        .catch(() => {
          showError(setSubmitting);
        })
        .finally(() => setBusy(false));
    } else {
      libraryService.createPeriodical(library.links.create_periodical, data)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        })
        .catch(() => {
          showError(setSubmitting);
        })
        .finally(() => setBusy(false));
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      setNewCover(file);
    }
  };

  const title = periodical ? intl.formatMessage({ id: 'periodical.editor.header.edit' }, { title: periodical.title }) : intl.formatMessage({ id: 'periodicals.action.create' });

  return (
    <div data-ft="edit-book-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <Error
        error={error}
        message={intl.formatMessage({ id: 'periodical.messages.notfound' })}
        actionText={intl.formatMessage({ id: 'action.back' })}
        onAction={() => history.goBack()}
      >
        <CenteredContent>
          <Formik
            initialValues={periodical || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({
              errors, values, touched, setFieldValue,
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
                      label={<FormattedMessage id="periodical.editor.fields.name.title" />}
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
                      label={<FormattedMessage id="periodical.editor.fields.description.title" />}
                      error={errors.description && touched.description}
                    />
                    <FrequencyDropDown
                      name="frequency"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={errors.frequency && touched.frequency}
                      label={intl.formatMessage({ id: 'periodical.editor.fields.frequency.title' })}
                    />
                    <FormControl variant="outlined" margin="normal" fullWidth error={errors.categories && touched.categories}>
                      <CategoriesDropDown
                        name="categories"
                        error={errors.categories && touched.categories}
                        label={intl.formatMessage({ id: 'periodical.editor.fields.categories.title' })}
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
                        imageUrl={periodical && periodical.links ? periodical.links.image : null}
                        defaultImage="/images/book_placeholder.jpg"
                        onImageSelected={handleImageUpload}
                        height="400"
                      />
                    </FormControl>
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
      </Error>
    </div>
  );
};

export default PeriodicalEditPage;
