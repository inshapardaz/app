import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// Formik
import { Formik, Field, Form } from 'formik';
import { Button, Grid } from '@mui/material';
import { TextField } from 'formik-mui';

// Local Imports
import actions from '@/actions';
import PageHeader from '@/components/pageHeader';
import Busy from '@/components/busy';
import CenteredContent from '@/components/layout/centeredContent';

const CategoryEditPage = () => {
  const { categoryId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState(null);
  const categories = useSelector((state) => state.libraryReducer.categories);

  const initialValues = {
    name: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(intl.formatMessage({ id: 'library.name.error.required' })),
  });

  useEffect(() => {
    if (categoryId && categories) {
      const selectedCategory = categories.data.filter((c) => c.id === parseInt(categoryId, 10))[0];
      setCategory(selectedCategory);
    }
  }, [categoryId, categories]);

  const onSubmit = (fields, { setSubmitting }) => {
    setBusy(true);
    if (category) {
      dispatch(actions.updateCategory(category.links.update, fields))
        .then(() => {
          setSubmitting(false);
          enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.saved' }), { variant: 'success' });
          history.goBack();
        }, () => {
          setBusy(false);
          enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.error.saving' }), { variant: 'error' });
        });
    } else {
      dispatch(actions.createCategory(fields))
        .then(() => {
          setSubmitting(false);
          enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.saved' }), { variant: 'success' });
          history.goBack();
        }, () => {
          setBusy(false);
          enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.error.saving' }), { variant: 'error' });
        });
    }
  };

  const title = category ? category.name : intl.formatMessage({ id: 'categories.action.create' });

  return (
    <div data-ft="edit-library-page">
      <Helmet title={title} />
      <PageHeader title={title} />
      <Busy busy={busy} />
      <CenteredContent>
        <Formik
          initialValues={category || initialValues}
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
                name="name"
                type="name"
                variant="outlined"
                margin="normal"
                fullWidth
                label={<FormattedMessage id="library.name.label" />}
                error={errors.name && touched.name}
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

export default CategoryEditPage;
