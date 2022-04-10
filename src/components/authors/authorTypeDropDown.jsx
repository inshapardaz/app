import React from 'react';
import { useIntl } from 'react-intl';

import { Field } from 'formik';
import { TextField } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';

// Local Imports
import AuthorTypes from '@/models/authorTypes';

const AuthorTypeDropDown = (props) => {
  const intl = useIntl();
  const authorTypes = [{
    key: AuthorTypes.Writer,
    name: intl.formatMessage({ id: 'authorTypes.writer' }),
  }, {
    key: AuthorTypes.Poet,
    name: intl.formatMessage({ id: 'authorTypes.poet' }),
  }];

  return (
    <Field component={TextField} select {...props}>
      {authorTypes.map((l) => <MenuItem key={l.key} value={l.key}>{l.name}</MenuItem>)}
    </Field>
  );
};

export default AuthorTypeDropDown;
