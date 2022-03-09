import React from 'react';

import { Field } from 'formik';
import { TextField } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';

// Local Imports
import { localeService } from '@/services';

const LanguageDropDown = (props) => {
  const languages = localeService.getLanguages();

  return (
    <Field component={TextField} select {...props}>
      {languages.map((l) => (<MenuItem key={l.locale} value={l.locale}>{l.name}</MenuItem>))}
    </Field>
  );
};

export default LanguageDropDown;
