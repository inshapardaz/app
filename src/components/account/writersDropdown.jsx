import React, { useDebugValue, useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';
import { Field } from 'formik';
import BootstrapInput from '../bootstrapInput';

const WritersDropDown = ({ onWriterSelected, error, value }, props) => {
	const intl = useIntl();
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loadingError, setLoadingError] = React.useState(false);

	useEffect(() => {
		let active = true;
		(() => {
			setLoading(true);
			libraryService.getWriters()
				.then(response => active && setOptions(response))
				.catch(() => setLoadingError(true))
				.finally(() => setLoading(false));
		})();
	}, []);

	// React.useEffect(() => {
	// 	if (!open) {
	// 		setOptions([]);
	// 	}
	// }, [open]);

	return (<Field component={Autocomplete} as="select" variant="outlined" input={<BootstrapInput />}
		{...props}
		options={options}
		loading={loading}
		open={open}
		onOpen={() => {
			setOpen(true);
		}}
		onClose={() => {
			setOpen(false);
		}}
		value={value}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
		noOptionsText={intl.formatMessage({ id: "person.messages.empty" })}
		onChange={(event, newValue) => onWriterSelected(newValue.id)}
		renderInput={(params) => (
			<TextField variant="outlined"
				{...params}
				label={props.label}
				error={error}
				onChange={event => setText(event.target.value)}
				InputProps={{
					...params.InputProps,
					endAdornment: (
						<React.Fragment>
							{loading ? <CircularProgress color="inherit" size={20} /> : null}
							{params.InputProps.endAdornment}
						</React.Fragment>
					)
				}}
			/>
		)}
	/>);
};

export default WritersDropDown;
