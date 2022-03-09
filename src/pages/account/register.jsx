import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Formik, Field, Form, ErrorMessage,
} from 'formik';
import queryString from 'query-string';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

// Local Imports
import { accountService } from '@/services';
import Busy from '@/components/busy';
import Copyright from '@/components/layout/footer/copyright';
import PageImage from '@/components/pageImage';

const RegistrationPage = () => {
  const location = useLocation();
  const history = useHistory();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [busy, setBusy] = useState(true);

  const initialValues = {
    name: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(intl.formatMessage({ id: 'register.message.name.required' })),
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'register.message.password.error.length' }))
      .required(intl.formatMessage({ id: 'register.message.password.required' })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'register.message.confirmPassword.error.match' }))
      .required(intl.formatMessage({ id: 'register.message.confirmPassword.required' })),
    acceptTerms: Yup.bool()
      .oneOf([true], intl.formatMessage({ id: 'register.message.acceptTerms.requires' })),
  });

  useEffect(() => {
    const { code } = queryString.parse(location.search);
    if (code) {
      accountService.verifyInvite(code)
        .then(() => setBusy(false))
        .catch((e) => {
          setBusy(false);
          if (e.status === 410) {
            enqueueSnackbar(intl.formatMessage({ id: 'invitation.message.expired' }), { variant: 'error' });
            history.push('/');
          } else if (e.status === 404) {
            enqueueSnackbar(intl.formatMessage({ id: 'invitation.message.notFound' }), { variant: 'error' });
            history.push('/');
          } else {
            history.push('/error/500');
          }
        });
    } else {
      history.push('/');
    }
  }, [location]);

  const onSubmit = (fields, { setSubmitting }) => {
    const { code } = queryString.parse(location.search);
    setBusy(true);
    accountService.register(code, fields)
      .then(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'register.message.success' }), { variant: 'success' });
        history.push('login');
      })
      .catch(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'register.message.error' }), { variant: 'error' });
      });
  };

  return (
    <Busy busy={busy}>
      <Grid container component="main" sx={{ height: '100vh' }} data-ft="register-page">
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
              <FormattedMessage id="register" />
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
                    name="name"
                    type="text"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="register.name.label" />}
                    error={errors.name && touched.name}
                  />

                  <Field
                    component={TextField}
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="register.password.label" />}
                    error={errors.password && touched.password}
                  />

                  <Field
                    component={TextField}
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="register.confirmPassword.label" />}
                    error={errors.confirmPassword && touched.confirmPassword}
                  />

                  <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name="acceptTerms"
                    margin="normal"
                    Label={{ label: intl.formatMessage({ id: 'register.acceptTerms.title' }) }}
                  />

                  <ErrorMessage
                    name="acceptTerms"
                    data-ft="acceptTerms-error"
                    render={(msg) => (<FormLabel sx={{ display: 'block', my: (theme) => theme.spacing(2) }} error data-ft="acceptTerms-error">{msg}</FormLabel>)}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    data-ft="register-button"
                    disabled={isSubmitting}
                    startIcon={<LoginIcon />}
                  >
                    <FormattedMessage id="register.action.title" />
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

export default RegistrationPage;
