import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import { Formik, Field, Form } from 'formik';
import {
  Button, Grid, FormControl, InputLabel,
} from '@mui/material';
import { TextField } from 'formik-material-ui';

// Local Imports
import { libraryService } from '@/services';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';
import LanguageDropDown from '@/components/language/languageDropDown';

const LibraryUserPage = () => {
  const { libraryId } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState(null);
  const entry = useSelector((state) => state.libraryReducer.entry);

  const initialValues = {
    email: '',
    role: 'reader',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(intl.formatMessage({ id: 'library.email.error.format' }))
      .required(intl.formatMessage({ id: 'library.email.error.required' })),
    role: Yup.string()
      .required(intl.formatMessage({ id: 'user.message.role.required' })),
  });

  useEffect(() => {
    if (libraryId) {
      setBusy(true);
      libraryService.getLibrary(libraryId)
        .then((lib) => setLibrary(lib))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.loading' }), { variant: 'error' });
          history.push('/error/500');
        });
    }
  }, [libraryId]);

  const onSubmit = (fields) => {
    setBusy(true);
    const createLink = entry && entry.links && entry.links.create;
    if (!library && createLink !== null) {
      libraryService
        .createLibrary(createLink, fields)
        .then(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' });
          history.goBack();
        })
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' });
        })
        .finally(() => setBusy(false));
    } else if (library !== null) {
      libraryService
        .updateLibrary(library.links.update, fields)
        .then(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' });
          history.goBack();
        })
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' });
        })
        .finally(() => setBusy(false));
    }
    setBusy(false);
  };

  const title = intl.formatMessage({ id: library ? 'user.add.title' : 'user.edit.title' });

  return (
    <div data-ft="edit-library-user-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={library || initialValues}
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
                disabled={library !== null}
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="library.email.label" />}
                error={errors.email && touched.email}
              />
              <Field
                component={TextField}
                name="name"
                type="text"
                disabled={library !== null}
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="library.name.label" />}
                error={errors.name && touched.name}
              />
              <FormControl variant="outlined" margin="normal" fullWidth>
                <InputLabel id="user_role"><FormattedMessage id="user.role.title" /></InputLabel>
                <LanguageDropDown
                  data-ft="language"
                  name="language"
                  label={intl.formatMessage({ id: 'user.role.title' })}
                  error={errors.language && touched.language}
                />
              </FormControl>
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

export default LibraryUserPage;
