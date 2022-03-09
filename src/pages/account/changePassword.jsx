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
import LockIcon from '@mui/icons-material/Lock';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';

// Local Imports
import { accountService } from '@/services';
import Busy from '@/components/busy';
import Copyright from '@/components/layout/footer/copyright';
import PageImage from '@/components/pageImage';

const ChangePasswordPage = () => {
  const history = useHistory();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const [busy, setBusy] = useState(false);

  const initialValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required(intl.formatMessage({ id: 'changePassword.message.oldPassword.required' })),
    password: Yup.string()
      .min(6, intl.formatMessage({ id: 'changePassword.message.password.error.length' }))
      .required(intl.formatMessage({ id: 'changePassword.message.password.required' })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'changePassword.message.confirmPassword.error.match' }))
      .required(intl.formatMessage({ id: 'changePassword.message.confirmPassword.required' })),
  });

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    accountService.changePassword(fields)
      .then(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'changePassword.message.success' }), { variant: 'success' });
        history.push('/');
      })
      .catch(() => {
        setBusy(false);
        setSubmitting(false);
        enqueueSnackbar(intl.formatMessage({ id: 'changePassword.message.error' }), { variant: 'error' });
      });
  };

  return (
    <Busy busy={busy}>
      <Grid container component="main" sx={{ height: '100vh' }} data-ft="change-password-page">
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
              <FormattedMessage id="changePassword.title" />
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
                    name="oldPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="changePassword.oldPassword.label" />}
                    error={errors.oldPassword && touched.oldPassword}
                  />
                  <Field
                    component={TextField}
                    name="password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="changePassword.password.label" />}
                    error={errors.password && touched.password}
                  />

                  <Field
                    component={TextField}
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label={<FormattedMessage id="changePassword.confirmPassword.label" />}
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
                    <FormattedMessage id="changePassword.submit" />
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link href="/" variant="body2" data-ft="home-link">
                        <FormattedMessage id="action.goto.home" />
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

export default ChangePasswordPage;
