import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import { Formik, Field, Form } from 'formik';
import {
  Button, Box, Grid,
  FormControl, InputAdornment,
} from '@mui/material';
import { TextField, CheckboxWithLabel } from 'formik-mui';
import ColorPicker from 'material-ui-color-picker';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import LanguageDropDown from '@/components/language/languageDropDown';
import CenteredContent from '@/components/layout/centeredContent';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

const ColorBox = ({ color }) => (
  <Box sx={{
    width: 20, height: 20, borderRadius: 1, backgroundColor: color,
  }}
  />
);

ColorBox.propTypes = {
  color: PropTypes.string.isRequired,
};

const LibraryEditPage = () => {
  const { libraryId } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState(null);
  const entry = useSelector((state) => state.libraryReducer.entry);

  const initialValues = {
    ownerEmail: '',
    name: '',
    language: 'en',
    supportsPeriodicals: false,
    primaryColor: '#373837',
    secondaryColor: '#848484',
  };

  const validationSchema = Yup.object().shape({
    ownerEmail: Yup.string()
      .email(intl.formatMessage({ id: 'library.email.error.format' }))
      .required(intl.formatMessage({ id: 'library.email.error.required' })),
    name: Yup.string()
      .required(intl.formatMessage({ id: 'library.name.error.required' })),
    language: Yup.string()
      .required(intl.formatMessage({ id: 'library.language.error.required' })),
    primaryColor: Yup.string(),
    secondaryColor: Yup.string(),
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
    } else if (entry && entry.links && entry.links.create == null) {
      history.push('/error/403');
    }
  }, [libraryId, entry]);

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
  };

  const title = library ? library.name : intl.formatMessage({ id: 'library.createNew' });

  return (
    <div data-ft="edit-library-page">
      <Helmet title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Breadcrumbs aria-label="breadcrumb" separator={<BreadcrumbSeparator />}>
          <Typography color="text.primary"><FormattedMessage id="header.administration" /></Typography>
          <Link underline="hover" color="inherit" to="/admin/libraries">
            <FormattedMessage id="admin.libraries.title" />
          </Link>
          {library
          && (
          <Link underline="hover" color="inherit" to={`/admin/libraries/${library.id}`}>
            {title}
          </Link>
          )}
          {!library
             && <Typography color="text.primary"><FormattedMessage id="library.editor.header.add" /></Typography>}
        </Breadcrumbs>
        <Formik
          initialValues={library || initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({
            errors, touched, values, setFieldValue,
          }) => (
            <Form>
              <Field
                component={TextField}
                autoFocus
                disabled={library !== null}
                name="ownerEmail"
                type="ownerEmail"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="library.email.label" />}
                error={errors.ownerEmail && touched.ownerEmail}
              />
              <Field
                component={TextField}
                name="name"
                type="text"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="library.name.label" />}
                error={errors.name && touched.name}
              />
              <LanguageDropDown
                data-ft="language"
                name="language"
                variant="outlined"
                margin="normal"
                fullWidth
                label={intl.formatMessage({ id: 'library.language.label' })}
                error={errors.language && touched.language}
              />
              <FormControl variant="outlined" margin="normal" fullWidth>
                <Field
                  data-ft="primary-color"
                  component={ColorPicker}
                  defaultValue="#373837"
                  InputProps={{ startAdornment: <InputAdornment position="start"><ColorBox color={values.primaryColor} /></InputAdornment> }}
                  value={values.primaryColor}
                  onChange={(color) => setFieldValue('primaryColor', color)}
                  label={intl.formatMessage({ id: 'library.primaryColor.label' })}
                  error={errors.primaryColor && touched.primaryColor}
                />
              </FormControl>
              <FormControl variant="outlined" margin="normal" fullWidth>
                <Field
                  data-ft="secondary-color"
                  component={ColorPicker}
                  InputProps={{ startAdornment: <InputAdornment position="start"><ColorBox color={values.secondaryColor} /></InputAdornment> }}
                  defaultValue="#848484"
                  value={values.secondaryColor}
                  onChange={(color) => setFieldValue('secondaryColor', color)}
                  label={intl.formatMessage({ id: 'library.secondaryColor.label' })}
                  error={errors.secondaryColor && touched.secondaryColor}
                />
              </FormControl>
              <Field
                component={CheckboxWithLabel}
                type="checkbox"
                id="supportsPeriodicals"
                name="supportsPeriodicals"
                margin="normal"
                Label={{ label: intl.formatMessage({ id: 'library.supportsPeriodical.label' }) }}
                error={errors.supportsPeriodicals && touched.supportsPeriodicals}
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

export default LibraryEditPage;
