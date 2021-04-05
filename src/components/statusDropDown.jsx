import React from 'react';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './bootstrapInput';
import { useIntl } from 'react-intl';

const StatusDropDown = (props) => {
	const intl = useIntl();
	const statuses = [{
		key: 'Available',
		name: intl.formatMessage({ id: 'status.Available' })
	}, {
		key: 'Typing',
		name: intl.formatMessage({ id: 'status.Typing' })
	}, {
		key: 'Typed',
		name: intl.formatMessage({ id: 'status.Typed' })
	}, {
		key: 'InReview',
		name: intl.formatMessage({ id: 'status.InReview' })
	}, {
		key: 'Completed',
		name: intl.formatMessage({ id: 'status.Completed' })
	}];

	return (
		<Field component={Select} as="select" input={<BootstrapInput />} {...props}>
			{statuses.map(l => <MenuItem key={l.key} value={l.key}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default StatusDropDown;
