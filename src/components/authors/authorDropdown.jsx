import React, { useDebugValue, useEffect, useState, label } from 'react';
import { useIntl } from "react-intl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';
import { Field } from 'formik';
import BootstrapInput from '../bootstrapInput';

const AuthorDropDown = ({ onAuthorSelected, error, value, label, variant }, props) => {
	const intl = useIntl();
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loadingError, setLoadingError] = React.useState(false);

	useEffect(() => {
		(() => {
			setLoading(true);
			libraryService.getAuthors(text, 1, 10)
				.then(response => setOptions(response.data))
				.catch(() => setLoadingError(true))
				.finally(() => setLoading(false));
		})();
	}, [text]);

	return (<Autocomplete
		{...props}
		options={options}
		loading={loading}
		value={value}
		onChange={(event, newValue) => onAuthorSelected(newValue)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option ? option.name : ''}
		noOptionsText={intl.formatMessage({ id: "authors.messages.empty" })}
		renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
	/>);
};

export default AuthorDropDown;
