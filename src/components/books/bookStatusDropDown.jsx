import React from 'react';
import { useIntl } from 'react-intl';

// MUI
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// formik
import { Field } from 'formik';
import { TextField } from 'formik-mui';

// Local Import
import EditStatusIcon from '@/components/editingStatusIcon';

const BookStatusDropDown = (props) => {
  const intl = useIntl();
  const statuses = [{
    key: 'Published',
    name: intl.formatMessage({ id: 'book.status.Published' }),
  }, {
    key: 'AvailableForTyping',
    name: intl.formatMessage({ id: 'book.status.AvailableForTyping' }),
  }, {
    key: 'BeingTyped',
    name: intl.formatMessage({ id: 'book.status.BeingTyped' }),
  }, {
    key: 'ReadyForProofRead',
    name: intl.formatMessage({ id: 'book.status.ReadyForProofRead' }),
  }, {
    key: 'ProofRead',
    name: intl.formatMessage({ id: 'book.status.ProofRead' }),
  }];

  return (
    <Field component={TextField} select {...props} SelectProps={{ renderValue: (v) => statuses.find((x) => x.key === v).name }}>
      {statuses.map((l) => (
        <MenuItem key={l.key} value={l.key}>
          <ListItemIcon>
            <EditStatusIcon status={l.key} showIfPublished />
          </ListItemIcon>
          <ListItemText>{l.name}</ListItemText>
        </MenuItem>
      ))}
    </Field>
  );
};

export default BookStatusDropDown;
