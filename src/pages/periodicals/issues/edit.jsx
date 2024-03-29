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
import { DatePicker } from 'formik-mui-lab';
import * as moment from 'moment';

// Local Imports
import { libraryService } from '@/services/';
import ImageUpload from '@/components/imageUpload';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import Error from '@/components/error';
import CenteredContent from '@/components/layout/centeredContent';

const IssueEditPage = () => {
  const { periodicalId, volumeNumber, issueNumber } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [periodical, setPeriodical] = useState(null);
  const [issue, setIssue] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const library = useSelector((state) => state.libraryReducer.library);

  const initialValues = {
    issueNumber: '',
    volumeNumber: '',
    issueDate: new Date(),
  };

  const validationSchema = Yup.object().shape({
    volumeNumber: Yup.string()
      .required(intl.formatMessage({ id: 'issue.editor.fields.volumeNumber.error' })),
    issueNumber: Yup.string()
      .required(intl.formatMessage({ id: 'issue.editor.fields.issueNumber.error' })),
    issueDate: Yup.date()
      .required(intl.formatMessage({ id: 'issue.editor.fields.issueDate.error' })),
  });

  useEffect(() => {
    if (periodicalId && library) {
      setBusy(true);
      libraryService.getPeriodicalById(library.id, periodicalId)
        .then((res) => setPeriodical(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
    if (periodicalId && issueNumber && library) {
      setBusy(true);
      libraryService.getIssue(library.id, periodicalId, volumeNumber, issueNumber)
        .then((res) => setIssue(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [periodicalId, issueNumber, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = (e, setSubmitting) => {
    setSubmitting(false);
    setBusy(false);
    if (e.status && e.status === 409) {
      enqueueSnackbar(intl.formatMessage({ id: 'issue.messages.error.conflict' }), { variant: 'error' });
    } else {
      enqueueSnackbar(intl.formatMessage({ id: 'issue.messages.error.saving' }), { variant: 'error' });
    }
  };

  const showSuccess = (setSubmitting) => {
    setBusy(false);
    setSubmitting(false);
    enqueueSnackbar(intl.formatMessage({ id: 'issue.messages.saved' }), { variant: 'success' });
    history.goBack();
  };

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    const data = { ...fields };
    const momentDate = moment(data.issueDate);
    data.issueDate = momentDate.format('YYYY-MM-01');
    if (issue) {
      libraryService.updateIssue(issue.links.update, data)
        .then((res) => uploadImage(res))
        .then(() => showSuccess(setSubmitting))
        .catch((e) => showError(e, setSubmitting))
        .finally(() => setBusy(false));
    } else {
      libraryService.createIssue(periodical.links.create_issue, data)
        .then((res) => uploadImage(res))
        .then(() => showSuccess(setSubmitting))
        .catch((e) => showError(e, setSubmitting))
        .finally(() => setBusy(false));
    }
  };

  const handleImageUpload = (file) => {
    if (file) {
      setNewCover(file);
    }
  };

  const title = issue ? intl.formatMessage({ id: 'issue.editor.header.edit' }, { issueNumber: issue.issueNumber }) : intl.formatMessage({ id: 'issue.editor.header.add' });

  return (
    <div data-ft="edit-issue-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <Error
        error={error}
        message={intl.formatMessage({ id: 'issues.message.notfound' })}
        actionText={intl.formatMessage({ id: 'action.back' })}
        onAction={() => history.goBack()}
      >
        <CenteredContent>
          <Formik
            initialValues={issue || initialValues}
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
                      name="issueNumber"
                      type="number"
                      variant="outlined"
                      margin="normal"
                      inputProps={{ min: 1 }}
                      fullWidth
                      label={<FormattedMessage id="issue.editor.fields.issueNumber.title" />}
                      error={errors.name && touched.name}
                    />
                    <Field
                      component={TextField}
                      name="volumeNumber"
                      type="number"
                      variant="outlined"
                      margin="normal"
                      inputProps={{ min: 1 }}
                      fullWidth
                      label={<FormattedMessage id="issue.editor.fields.volumeNumber.title" />}
                      error={errors.description && touched.description}
                    />
                    <Field
                      component={DatePicker}
                      name="issueDate"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      label={<FormattedMessage id="issue.editor.fields.issueDate.title" />}
                      error={errors.description && touched.description}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <FormControl variant="outlined" margin="normal" fullWidth>
                      <ImageUpload
                        imageUrl={issue && issue.links ? issue.links.image : null}
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

export default IssueEditPage;
