import React from 'react';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './bootstrapInput';
import { FormattedMessage } from 'react-intl';

const StatusDropDown = (props) => (
	<Field component={Select} as="select" variant="outlined" input={<BootstrapInput />} {...props}>
		<MenuItem value={0}><FormattedMessage id="status.Available" /></MenuItem>
		<MenuItem value={1}><FormattedMessage id="status.Typing" /></MenuItem>
		<MenuItem value={2}><FormattedMessage id="status.Typed" /></MenuItem>
		<MenuItem value={3}><FormattedMessage id="status.InReview" /></MenuItem>
		<MenuItem value={4}><FormattedMessage id="status.Completed" /></MenuItem>
	</Field>
);

export default StatusDropDown;
