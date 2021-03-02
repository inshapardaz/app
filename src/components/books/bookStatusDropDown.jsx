import React from 'react';
import { useIntl } from "react-intl";
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from '../bootstrapInput';

const BookStatusDropDown = (props) => {
	const intl = useIntl();
	const locals = [{
		id: 0,
		name: intl.formatMessage({ id: 'book.status.0' })
	}, {
		id: 1,
		name: intl.formatMessage({ id: 'book.status.1' })
	}, {
		id: 2,
		name: intl.formatMessage({ id: 'book.status.2' })
	}, {
		id: 3,
		name: intl.formatMessage({ id: 'book.status.3' })
	}, {
		id: 4,
		name: intl.formatMessage({ id: 'book.status.4' })
	}];

	return (
		<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
			{locals.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default BookStatusDropDown;
