import React from 'react';
import { Field } from 'formik';
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from './bootstrapInput';

const LanguageDropDown = (props) => (
	<Field component={Select} variant="outlined" {...props}>
		<MenuItem value="en">English</MenuItem>
		<MenuItem value="ur">اردو</MenuItem>
		<MenuItem value="hi">हिंदी</MenuItem>
		<MenuItem value="pn">پنجابی</MenuItem>
	</Field>
);

export default LanguageDropDown;
