import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { libraryService } from '../../services';

const SeriesDropDown = ({ label, value, onSeriesSelected }, props) => {
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [loadingError, setLoadingError] = React.useState(false);

	React.useEffect(() => {
		(() => {
			setLoading(true);
			libraryService.getSeries(text, 1, 10)
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
		onChange={(event, newValue) => onSeriesSelected(newValue)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option.name}
		onInputChange={(e, value) => setText(value)}
		renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
	/>);
};

export default SeriesDropDown;
