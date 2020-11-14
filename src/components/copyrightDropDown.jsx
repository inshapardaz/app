import React from 'react';
import Select from '@material-ui/core/Select';
import { useIntl } from 'react-intl';

const CopyrightDropDown = (props) =>
{
	const intl = useIntl();
	const locals = [{
		id : 0,
		name : intl.formatMessage({ id : 'copyrights.0' })
	}, {
		id : 1,
		name : intl.formatMessage({ id : 'copyrights.1' })
	}, {
		id : 2,
		name : intl.formatMessage({ id : 'copyrights.2' })
	}, {
		id : 3,
		name : intl.formatMessage({ id : 'copyrights.3' })
	}];
	return  <Select {...props} >
		{locals.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
	</Select>;
};

export default CopyrightDropDown;
