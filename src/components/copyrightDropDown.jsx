import React from 'react';
import { useIntl } from 'react-intl';

// Formik
import { Field } from 'formik';
import { TextField } from 'formik-mui';

// MUI
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Import
import CopyrightIcon from '@/components/copyrightIcon';

const CopyrightDropDown = (props) => {
  const intl = useIntl();
  const locals = [{
    id: 'Copyright',
    name: intl.formatMessage({ id: 'copyrights.Copyright' }),
  }, {
    id: 'PublicDomain',
    name: intl.formatMessage({ id: 'copyrights.PublicDomain' }),
  }, {
    id: 'Open',
    name: intl.formatMessage({ id: 'copyrights.Open' }),
  }, {
    id: 'CreativeCommons',
    name: intl.formatMessage({ id: 'copyrights.CreativeCommons' }),
  }];

  return (
    <Field component={TextField} select {...props} SelectProps={{ renderValue: (v) => locals.find((x) => x.id === v).name }}>
      {locals.map((l) => (
        <MenuItem key={l.id} value={l.id}>
          <ListItemIcon>
            <CopyrightIcon status={l.id} />
          </ListItemIcon>
          <ListItemText>{l.name}</ListItemText>
        </MenuItem>
      ))}
    </Field>
  );
};

export default CopyrightDropDown;
