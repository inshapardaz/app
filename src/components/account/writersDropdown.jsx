import React, { useDebugValue, useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';
import { Field } from 'formik';
import BootstrapInput from '../bootstrapInput';

const WritersDropDown = ({ onWriterSelected, error, value, label, variant }, props) => {
	const intl = useIntl();
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loadingError, setLoadingError] = React.useState(false);

	useEffect(() => {
		(() => {
			setLoading(true);
			libraryService.getWriters(text == value && value.accountName ? null : text)
				.then(response => setOptions(response))
				.catch(() => setLoadingError(true))
				.finally(() => setLoading(false));
		})();
	}, [text]);


	return (<Autocomplete
		{...props}
		options={options}
		loading={loading}
		value={value}
		onChange={(event, newValue) => onWriterSelected(newValue)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option ? `${option.accountName}` : ''}
		noOptionsText={intl.formatMessage({ id: "person.messages.empty" })}
		onInputChange={(e, value) => setText(value)}
		renderInput={(params) => <TextField {...params} label={label} error={error} variant={variant} />}
	/>);
};

export default WritersDropDown;
