import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const LanguageDropDown = (props) => {
	const locals = [{
		id: 'en',
		name: 'English'
	}, {
		id: 'ur',
		name: 'Urdu'
	}];
	return <Select {...props} >
		{locals.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
	</Select>;
};

export default LanguageDropDown;
