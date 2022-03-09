import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { TextField } from 'formik-mui';
import LockOutlinedIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

// Local Imports
import { accountService } from '@/services';
import Busy from '@/components/busy';
import Copyright from '@/components/layout/footer/copyright';
import PageImage from '@/components/pageImage';

const ForgetPasswordPage = () => {
  const history = useHistory();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [busy, setBusy] = useState(false);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'forgotPassword.message.email.error' }))
      .required(intl.formatMessage({ id: 'forgotPassword.message.email.required' })),
  });

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    accountService.forgotPassword(fields.email)
      .then(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'forgotPassword.message.success' }), { variant: 'success' });
        history.push('login');
      })
      .catch(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'forgotPassword.message.error' }), { variant: 'error' });
      });
  };

  return (
    <Busy busy={busy}>
      <Grid container component="main" sx={{ height: '100vh' }} data-ft="forget-password-page">
        <PageImage />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', margin: (theme) => theme.spacing(8, 4),
          }}
          >
            <Avatar xs={{
              margin: (theme) => theme.spacing(1),
              backgroundColor: (theme) => theme.palette.secondary.main,
            }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              <FormattedMessage id="forgot.password" />
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={onSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form noValidate>
                  <Field
                    component={TextField}
                    name="email"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="forgotPassword.email.title" />}
                    error={errors.email && touched.email}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    data-ft="submit-button"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="forgotPassword.submit" />
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link href="/account/login" variant="body2" data-ft="login-link">
                        <FormattedMessage id="login" />
                      </Link>
                    </Grid>
                  </Grid>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </Busy>
  );
};

export default ForgetPasswordPage;
