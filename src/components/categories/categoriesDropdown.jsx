import React, { useState, useEffect } from 'react';
import { useIntl } from "react-intl";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';
import { Field } from 'formik';
import BootstrapInput from '../bootstrapInput';

const CategoriesDropDown = ({ error, onCategoriesSelected, defaultValue }, props) => {
	const intl = useIntl();
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(false);

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

	return (<Field component={Autocomplete} variant="outlined" input={<BootstrapInput />}
		{...props}
		multiple
		filterSelectedOptions
		defaultValue={defaultValue}
		open={open}
		onOpen={() => {
			setOpen(true);
		}}
		onClose={() => {
			setOpen(false);
		}}
		options={options}
		loading={loading}
		onChange={(event, newValue) => onCategoriesSelected(newValue)}
		getOptionSelected={(option, value) => option.id === value.id}
		getOptionLabel={(option) => option.name}
		noOptionsText={intl.formatMessage({ id: "book.editor.fields.categories.error" })}
		renderInput={(params) => (
			<TextField variant="outlined"
				{...params}
				error={error}
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

export default CategoriesDropDown;
