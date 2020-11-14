import React from 'react';
import Select from '@material-ui/core/Select';

const LanguageDropDown = (props) =>
{
	const locals = [{
		id : 'en',
		name : 'English'
	}, {
		id : 'ur',
		name : 'Urdu'
	}];
	return  <Select {...props} >
		{locals.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
	</Select>;
};

export default LanguageDropDown;
