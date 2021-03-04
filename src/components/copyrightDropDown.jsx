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
		name: intl.formatMessage({ id: 'copyrights.Copyright' })
	}, {
		id: 1,
		name: intl.formatMessage({ id: 'copyrights.PublicDomain' })
	}, {
		id: 2,
		name: intl.formatMessage({ id: 'copyrights.Open' })
	}, {
		id: 3,
		name: intl.formatMessage({ id: 'copyrights.CreativeCommons' })
	}];

	return (
		<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
			{locals.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default CopyrightDropDown;
