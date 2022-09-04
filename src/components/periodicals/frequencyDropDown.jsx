import React from 'react';
import { useIntl } from 'react-intl';

// Formik
import { Field } from 'formik';
import { TextField } from 'formik-mui';

// MUI
import MenuItem from '@mui/material/MenuItem';

const FrequencyDropDown = (props) => {
  const intl = useIntl();
  const locals = [{
    id: 'Unknown',
    name: intl.formatMessage({ id: 'frequency.Unknown' }),
  }, {
    id: 'Annually',
    name: intl.formatMessage({ id: 'frequency.Annually' }),
  }, {
    id: 'Quarterly',
    name: intl.formatMessage({ id: 'frequency.Quarterly' }),
  }, {
    id: 'Monthly',
    name: intl.formatMessage({ id: 'frequency.Monthly' }),
  }, {
    id: 'Fortnightly',
    name: intl.formatMessage({ id: 'frequency.Fortnightly' }),
  }, {
    id: 'Weekly',
    name: intl.formatMessage({ id: 'frequency.Weekly' }),
  }, {
    id: 'Daily',
    name: intl.formatMessage({ id: 'frequency.Daily' }),
  }];

  return (
    <Field component={TextField} select {...props}>
      {locals.map((l) => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
    </Field>
  );
};

export default FrequencyDropDown;
