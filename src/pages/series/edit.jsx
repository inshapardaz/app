import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import {
  Formik, Field, Form,
} from 'formik';
import { Button, Grid, FormControl } from '@mui/material';
import { TextField } from 'formik-mui';

// Local Imports
import ImageUpload from '@/components/imageUpload';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';
import libraryService from '../../services/library.service';

const SeriesEditPage = () => {
  const { seriesId } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [series, setSeries] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const library = useSelector((state) => state.libraryReducer.library);

  const initialValues = {
    name: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(intl.formatMessage({ id: 'library.name.error.required' })),
  });

  useEffect(() => {
    if (seriesId && library) {
      setBusy(true);
      libraryService.getSeriesById(library.id, seriesId)
        .then((res) => setSeries(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [seriesId, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = (setSubmitting) => {
    setSubmitting(false);
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.saving' }), { variant: 'error' });
  };

  const showSuccess = (setSubmitting) => {
    setBusy(false);
    setSubmitting(false);
    enqueueSnackbar(intl.formatMessage({ id: 'series.messages.saved' }), { variant: 'success' });
    history.goBack();
  };

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    if (series) {
      libraryService.updateSeries(series.links.update, fields)
        .then((res) => {
          uploadImage(res)
            .then(() => showSuccess(setSubmitting), () => showError(setSubmitting));
        }, () => showError(setSubmitting));
    } else {
      libraryService.createSeries(library.links.create_series, fields)
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

  const title = series ? series.name : intl.formatMessage({ id: 'series.action.create' });

  return (
    <div data-ft="edit-series-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={series || initialValues}
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
                    label={<FormattedMessage id="series.editor.fields.name.title" />}
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
                    rows={15}
                    label={<FormattedMessage id="series.editor.fields.description.title" />}
                    error={errors.description && touched.description}
                  />
                </Grid>

                <Grid item md={6}>
                  <FormControl variant="outlined" margin="normal" fullWidth>
                    <ImageUpload
                      imageUrl={series && series.links ? series.links.image : null}
                      defaultImage="/images/series_placeholder.jpg"
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

export default SeriesEditPage;
