import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import queryString from 'query-string';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { TextField } from 'formik-mui';
import LockIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

// Local Imports
import { accountService } from '@/services';
import Busy from '@/components/busy';
import Copyright from '@/components/layout/footer/copyright';
import PageImage from '@/components/pageImage';

const ResetPasswordPage = () => {
  const location = useLocation();
  const history = useHistory();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [busy, setBusy] = useState(false);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'resetPassword.message.password.error.length' }))
      .required(intl.formatMessage({ id: 'resetPassword.message.password.required' })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'resetPassword.message.confirmPassword.error.match' }))
      .required(intl.formatMessage({ id: 'resetPassword.message.confirmPassword.required' })),
  });

  const onSubmit = (fields, { setSubmitting }) => {
    const { code } = queryString.parse(location.search);
    setBusy(true);
    accountService.resetPassword({ code, ...fields })
      .then(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'resetPassword.message.success' }), { variant: 'success' });
        history.push('/login');
      })
      .catch(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'resetPassword.message.error' }), { variant: 'error' });
      });
  };

  return (
    <Busy busy={busy}>
      <Grid container component="main" sx={{ height: '100vh' }} data-ft="reset-password-page">
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
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              <FormattedMessage id="resetPassword.title" />
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
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="resetPassword.password.label" />}
                    error={errors.password && touched.password}
                  />

                  <Field
                    component={TextField}
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="resetPassword.confirmPassword.label" />}
                    error={errors.confirmPassword && touched.confirmPassword}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    data-ft="submit-button"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="resetPassword.submit" />
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link href="/account/login" variant="body2" data-ft="login-link">
                        <FormattedMessage id="login" />
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="/account/forgot-password" variant="body2" data-ft="forget-password-link">
                        <FormattedMessage id="forgot.password" />
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

export default ResetPasswordPage;
