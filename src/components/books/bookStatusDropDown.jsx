import React from 'react';
import { useIntl } from "react-intl";
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from '../bootstrapInput';

const BookStatusDropDown = (props) => {
	const intl = useIntl();
	const statuses = [{
		key: 'Published',
		name: intl.formatMessage({ id: 'book.status.Published' })
	}, {
		key: 'AvailableForTyping',
		name: intl.formatMessage({ id: 'book.status.AvailableForTyping' })
	}, {
		key: 'BeingTyped',
		name: intl.formatMessage({ id: 'book.status.BeingTyped' })
	}, {
		key: 'ReadyForProofRead',
		name: intl.formatMessage({ id: 'book.status.ReadyForProofRead' })
	}, {
		key: 'ProofRead',
		name: intl.formatMessage({ id: 'book.status.ProofRead' })
	}];

	return (
		<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
			{statuses.map(l => <MenuItem key={l.key} value={l.key}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default BookStatusDropDown;
