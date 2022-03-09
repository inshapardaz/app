import React from 'react';
import { useIntl } from 'react-intl';

// Formik
import { Field } from 'formik';
import { TextField } from 'formik-mui';

// MUI
import MenuItem from '@mui/material/MenuItem';

const RoleDropDown = (props) => {
  const intl = useIntl();
  const roles = [{
    value: 'libraryAdmin',
    name: intl.formatMessage({ id: 'role.libraryAdmin' }),
  }, {
    value: 'writer',
    name: intl.formatMessage({ id: 'role.writer' }),
  }, {
    value: 'reader',
    name: intl.formatMessage({ id: 'role.reader' }),
  }];

  return (
    <Field component={TextField} select {...props}>
      {roles.map((r) => <MenuItem key={r.value} value={r.value}>{r.name}</MenuItem>)}
    </Field>
  );
};

export default RoleDropDown;
