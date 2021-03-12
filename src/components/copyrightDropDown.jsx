import React from 'react';
import { useIntl } from "react-intl";
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';

const CopyrightDropDown = (props) => {
	const intl = useIntl();
	const locals = [{
		id: "Copyright",
		name: intl.formatMessage({ id: 'copyrights.Copyright' })
	}, {
		id: "PublicDomain",
		name: intl.formatMessage({ id: 'copyrights.PublicDomain' })
	}, {
		id: "Open",
		name: intl.formatMessage({ id: 'copyrights.Open' })
	}, {
		id: "CreativeCommons",
		name: intl.formatMessage({ id: 'copyrights.CreativeCommons' })
	}];

	return (
		<Field component={Select} as="select" {...props}>
			{locals.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
		</Field>
	);
};

export default CopyrightDropDown;
