import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import { Formik, Field, Form } from 'formik';
import { Button, Grid } from '@mui/material';
import { TextField } from 'formik-mui';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';
import RoleDropDown from '@/components/roleDropDown';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

const LibraryUserPage = () => {
  const { libraryId, userId } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState(null);
  const [user, setUser] = useState(null);

  const initialValues = {
    email: '',
    name: '',
    role: 'reader',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'library.email.error.format' }))
      .required(intl.formatMessage({ id: 'library.email.error.required' })),
    name: Yup.string()
      .required(intl.formatMessage({ id: 'user.name.required' })),
    role: Yup.string()
      .required(intl.formatMessage({ id: 'user.message.role.required' })),
  });

  const loadUser = () => {
    if (userId) {
      return libraryService.getUser(libraryId, userId)
        .then((u) => setUser(u));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (libraryId) {
      setBusy(true);
      libraryService.getLibrary(libraryId)
        .then((lib) => {
          setLibrary(lib);
        })
        .then(() => loadUser())
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.loading' }), { variant: 'error' });
          history.push('/error/500');
        })
        .finally(() => setBusy(false));
    }
  }, [libraryId]);

  const onSubmit = (fields) => {
    setBusy(true);
    if (!user && library.links.add_user) {
      libraryService
        .addUser(library.links.add_user, fields)
        .then(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'user.messages.added.success' }), { variant: 'success' });
          history.goBack();
        })
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'user.messages.added.error' }), { variant: 'error' });
        })
        .finally(() => setBusy(false));
    } else if (library !== null) {
      libraryService
        .updateUser(user.links.update_user, fields)
        .then(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'user.messages.updated.success' }), { variant: 'success' });
          history.goBack();
        })
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'user.messages.updated.error' }), { variant: 'error' });
        })
        .finally(() => setBusy(false));
    }
  };

  const title = intl.formatMessage({ id: library ? 'user.add.title' : 'user.edit.title' });

  return (
    <div data-ft="edit-library-user-page">
      <Helmet title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Breadcrumbs aria-label="breadcrumb" separator={<BreadcrumbSeparator />}>
          <Typography color="text.primary"><FormattedMessage id="header.administration" /></Typography>
          <Link underline="hover" color="inherit" to="/admin/libraries">
            <FormattedMessage id="admin.libraries.title" />
          </Link>
          {library && (
          <Link underline="hover" color="inherit" to={`/admin/libraries/${library.id}`}>
            {library.name}
          </Link>
          )}
          {user
             && <Typography color="text.primary"><FormattedMessage id="admin.users.title" /></Typography>}
          {user
             && <Typography color="text.primary">{user.name}</Typography>}
          {!user
             && <Typography color="text.primary"><FormattedMessage id="user.add.title" /></Typography>}
        </Breadcrumbs>
        <Formik
          initialValues={user || initialValues}
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
                autoFocus
                disabled={!library}
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="user.email.label" />}
                error={errors.email && touched.email}
              />
              <Field
                component={TextField}
                name="name"
                type="text"
                disabled={!library}
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="user.name.label" />}
                error={errors.name && touched.name}
              />
              <RoleDropDown
                data-ft="role"
                name="role"
                variant="outlined"
                margin="normal"
                fullWidth
                label={intl.formatMessage({ id: 'user.role.label' })}
                error={errors.role && touched.role}
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
                    <FormattedMessage id="action.cancel" />
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

export default LibraryUserPage;
