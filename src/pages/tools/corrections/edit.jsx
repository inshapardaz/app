import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import { Formik, Field, Form } from 'formik';
import { Button, Grid } from '@mui/material';
import { TextField } from 'formik-mui';

// Local Imports
import { toolsService } from '@/services';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';

const CorrectionEditPage = () => {
  const { language, profile, id } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [correction, setCorrection] = useState(null);

  const initialValues = {
    incorrectText: '',
    correctText: '',
  };

  const validationSchema = Yup.object().shape({
    incorrectText: Yup.string()
      .required(intl.formatMessage({ id: 'correction.incorrectText.error.required' })),
    correctText: Yup.string()
      .required(intl.formatMessage({ id: 'correction.correctText.error.required' })),
  });

  useEffect(() => {
    if (id) {
      setBusy(true);
      toolsService.getCorrection(language, profile, id)
        .then((res) => setCorrection(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
        });
    }
  }, [language, profile, id]);

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    if (correction) {
      toolsService.updateCorrection(fields)
        .then(() => {
          setSubmitting(false);
          enqueueSnackbar(intl.formatMessage({ id: 'correction.messages.saved' }), { variant: 'success' });
          history.goBack();
        }, () => {
          setBusy(false);
          enqueueSnackbar(intl.formatMessage({ id: 'correction.messages.error.saving' }), { variant: 'error' });
        });
    } else {
      fields.language = language;
      fields.profile = profile;
      toolsService.addCorrection(fields)
        .then(() => {
          setSubmitting(false);
          enqueueSnackbar(intl.formatMessage({ id: 'correction.messages.saved' }), { variant: 'success' });
          history.goBack();
        }, () => {
          setBusy(false);
          enqueueSnackbar(intl.formatMessage({ id: 'correction.messages.error.saving' }), { variant: 'error' });
        });
    }
  };

  const title = correction ? correction.incorrectText : intl.formatMessage({ id: 'correction.action.create' });

  return (
    <div data-ft="edit-library-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={correction || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({
            errors, touched,
          }) => (
            <Form>
              <Field
                component={TextField}
                autoFocus={correction === null}
                name="incorrectText"
                type="incorrectText"
                variant="outlined"
                margin="normal"
                disabled={correction !== null}
                fullWidth
                label={<FormattedMessage id="correction.incorrectText.label" />}
                error={errors.incorrectText && touched.incorrectText}
              />
              <Field
                component={TextField}
                autoFocus={correction !== null}
                name="correctText"
                type="correctText"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="correction.correctText.label" />}
                error={errors.correctText && touched.correctText}
              />
              <Grid container spacing={2} sx={{ my: (theme) => theme.spacing(2) }}>
                <Grid item md={6} xs={12}>
                  <Button
                    id="submitButton"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="action.save" />
                  </Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    id="cancelButton"
                    fullWidth
                    variant="outlined"
                    onClick={() => history.goBack()}
                  >
                    Cancel

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

export default CorrectionEditPage;
