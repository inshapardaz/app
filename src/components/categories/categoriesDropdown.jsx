import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { libraryService } from '../../services';

const CategoriesDropDown = ({ label, value, onCategoriesSelected }, props) => {
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(() => {
			libraryService.getCategories()
				.then(response => {
					setOptions(response.data);
				})
				.catch(() => setLoadingError(true))
				.finally(() => setLoading(false));
		})();
	}, []);

	return (<Autocomplete
		{...props}
		multiple
		filterSelectedOptions
		options={options}
		loading={loading}
		value={value}
		onChange={(event, newValue) => onCategoriesSelected(newValue)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option.name}
		renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
	/>)
};

export default CategoriesDropDown;
