import React from 'react';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './bootstrapInput';
import { FormattedMessage } from 'react-intl';

const StatusDropDown = (props) => (
	<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
		<MenuItem value={0}><FormattedMessage id="status.0" /></MenuItem>
		<MenuItem value={1}><FormattedMessage id="status.1" /></MenuItem>
		<MenuItem value={2}><FormattedMessage id="status.2" /></MenuItem>
		<MenuItem value={3}><FormattedMessage id="status.3" /></MenuItem>
		<MenuItem value={4}><FormattedMessage id="status.4" /></MenuItem>
	</Field>
);

export default StatusDropDown;
