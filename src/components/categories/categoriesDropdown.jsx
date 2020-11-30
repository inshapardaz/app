import React from "react";
import { Input, MenuItem, Select } from "@material-ui/core";
import { libraryService } from "../../services";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const CategoriesDropDown = (props) => {
	const [loading, setLoading] = React.useState();
	const [options, setOptions] = React.useState([]);
	const [error, setError] = React.useState(false);

	React.useEffect(() => {
		if (!open) {
			return;
		}

		(() => {
			setLoading(true);
			libraryService
				.getCategories()
				.then((response) => setOptions(response.data))
				.catch(() => setError(true))
				.finally(() => setLoading(false));
		})();
	}, []);

	return (
		<Select
			{...props}
			multiple
			value={props.value}
			onChange={props.onChange}
			input={<Input />}
			MenuProps={MenuProps}
		>
			{options.map((cat) => (
				<MenuItem key={cat.id} value={cat.id}>
					{cat.name}
				</MenuItem>
			))}
		</Select>
	);
};

export default CategoriesDropDown;
