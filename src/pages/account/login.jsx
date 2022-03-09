import React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { TextField } from 'formik-mui';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Copyright from '@/components/layout/footer/copyright';
import Busy from '@/components/busy';
import PageImage from '@/components/pageImage';
import actions from '@/actions';

const LoginPage = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'login.message.email.error' }))
      .required(intl.formatMessage({ id: 'login.message.email.required' })),
    password: Yup.string().required(intl.formatMessage({ id: 'login.message.password.required' })),
  });

  const onSubmit = ({ email, password }, { setSubmitting }) => {
    dispatch(actions.loginAction(email, password, setSubmitting))
      .then(() => setSubmitting(false));
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }} data-ft="login-page">
      <PageImage />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: (theme) => theme.spacing(8, 4),
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
            <FormattedMessage id="login" />
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
                <Busy busy={isSubmitting} />
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  autoFocus
                  label={<FormattedMessage id="login.email.title" />}
                  error={errors.email && touched.email}
                />

                <Field
                  component={TextField}
                  name="password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label={<FormattedMessage id="login.password.title" />}
                  error={errors.password && touched.password}
                />

                <Button
                  data-ft="login-button"
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<LoginIcon />}
                >
                  <FormattedMessage id="login" />
                </Button>
                <Grid container>
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
  );
};

export default LoginPage;
