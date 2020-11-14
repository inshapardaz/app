import React from 'react';
import { Input, MenuItem, Select } from '@material-ui/core';
import LibraryService from '../../services/LibraryService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps :
	{
		style :
		{
      		maxHeight : ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width : 250
		}
  	}
};

const CategoriesDropDown = (props) =>
{
	const [loading, setLoading] = React.useState();
	const [options, setOptions] = React.useState([]);

	React.useEffect(() =>
	{
		if (!open)
		{
			return;
		}

		(async () =>
		{
			setLoading(true);
			try
			{
				const response = await LibraryService.getCategories();
				const categories = response.data;
				setOptions(categories);
			}
			finally
			{
				setLoading(false);
			}
		})();
	}, []);

	return (<Select {...props}
		multiple
		value={props.value}
		onChange={props.onChange}
		input={<Input />}
		MenuProps={MenuProps}>
		{options.map((cat) => (
			<MenuItem key={cat.id} value={cat.id} >
				{cat.name}
			</MenuItem>
		))}
	</Select>);
};

export default CategoriesDropDown;
