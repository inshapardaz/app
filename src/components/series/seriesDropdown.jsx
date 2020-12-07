import React from 'react';
import { useIntl } from "react-intl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';
import { Field } from 'formik';
import BootstrapInput from '../bootstrapInput';

const SeriesDropDown = ({ onSeriesSelected, error, defaultValue }, props) => {
	const intl = useIntl();
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loadingError, setLoadingError] = React.useState(false);

	React.useEffect(() => {
		if (!open) {
			return;
		}

		(() => {
			setLoading(true);
			libraryService.getSeries(text, 1, 10)
				.then(response => setOptions(response.data))
				.catch(() => setLoadingError(true))
				.finally(() => setLoading(false));
		})();
	}, [text]);

	React.useEffect(() => {
		if (!open) {
			setOptions([]);
		}
	}, [open]);

	return (<Field component={Autocomplete} as="select" variant="outlined" input={<BootstrapInput />}
		{...props}
		open={open}
		onOpen={() => {
			setOpen(true);
		}}
		onClose={() => {
			setOpen(false);
		}}
		defaultValue={defaultValue}
		options={options}
		loading={loading}
		onChange={(event, newValue) => onSeriesSelected(newValue.id)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option.name}
		noOptionsText="No series selected"
		renderInput={(params) => (
			<TextField variant="outlined"
				{...params}
				label={props.label}
				onChange={event => setText(event.target.value)}
				error={error}
				value={text || ''}
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

export default SeriesDropDown;
