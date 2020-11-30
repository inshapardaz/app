import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { libraryService } from '../../services';

const AuthorDropDown = (props) =>
{
	const [open, setOpen] = React.useState(false);
	const [options, setOptions] = React.useState([]);
	const [text, setText] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);

	React.useEffect(() =>
	{
		if (!open)
		{
			return;
		}

		(() =>
		{
			setLoading(true);
			libraryService.getAuthors(text, 1, 10)
				.then(response => setOptions(response.data))
				.catch(() => setError(true))
				.finally(() => setLoading(false));
		})();
	}, [text]);

	React.useEffect(() =>
	{
		if (!open)
		{
			setOptions([]);
		}
	}, [open]);

	return (<Autocomplete
		{...props}
		open={open}
		onOpen={() =>
		{
			setOpen(true);
		}}
		onClose={() =>
		{
			setOpen(false);
		}}
		options={options}
		loading={loading}
		onChange={(event, newValue) => props.onChange(newValue)}
		getOptionSelected={(option, value) => option.name === value }
		getOptionLabel={(option) => option.name}
		noOptionsText="No series selected"
		renderInput={(params) => (
			<TextField
				{...params}
				label={props.label}
				onChange={event => setText(event.target.value)}
				value={text}
				InputProps={{
					...params.InputProps,
					endAdornment : (
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

export default AuthorDropDown;
