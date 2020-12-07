import React from 'react';
import { useIntl } from "react-intl";
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './bootstrapInput';

const CopyrightDropDown = (props) => {
	const intl = useIntl();
	const locals = [{
		id: 0,
		name: intl.formatMessage({ id: 'copyrights.0' })
	}, {
		id: 1,
		name: intl.formatMessage({ id: 'copyrights.1' })
	}, {
		id: 2,
		name: intl.formatMessage({ id: 'copyrights.2' })
	}, {
		id: 3,
		name: intl.formatMessage({ id: 'copyrights.3' })
	}];

	return (
		<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
			{locals.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default CopyrightDropDown;
