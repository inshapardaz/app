import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import { useIntl, FormattedMessage } from "react-intl";

const getFontSizes = (intl) => [
	{
		key: "0.75",
		value: intl.formatMessage({ id: "fontSize.small" })
	},
	{
		key: "1",
		value: intl.formatMessage({ id: "fontSize.normal" })
	},
	{
		key: "1.25",
		value: intl.formatMessage({ id: "fontSize.medium" })
	},
	{
		key: "1.5",
		value: intl.formatMessage({ id: "fontSize.large" })
	},
	{
		key: "1.75",
		value: intl.formatMessage({ id: "fontSize.larger" })
	},
	{
		key: "2",
		value: intl.formatMessage({ id: "fontSize.extraLarge" })
	}
];

const FontSize = ({ value, onFontSizeSelected, storageKey }) => {
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const fontSizes = getFontSizes(intl);
	const [fontSize, setFontSize] = useState(null);

	useEffect(() => {
		let selectedFontSize = fontSizes.find(f => f.key === value);
		if (selectedFontSize !== undefined) {
			setFontSize(selectedFontSize);
			localStorage.setItem(storageKey, selectedFontSize.key);
		}
	}, [value]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const onSelected = (f) => {
		setFontSize(f);
		onFontSizeSelected && onFontSizeSelected(f.key);
		if (storageKey) {
			localStorage.setItem(storageKey, f.key);
		}
		handleClose();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button aria-controls="font-size-menu" aria-haspopup="true"
				onClick={handleClick} startIcon={<FormatSizeIcon />} endIcon={<ExpandMoreIcon />}>
				{fontSize !== null ? fontSize.value : intl.formatMessage({ id: "fontSize.none" })}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				value={value}
			>
				{
					fontSizes.map(s => <MenuItem key={s.key} onClick={() => onSelected(s)} value={s.key}>{s.value}</MenuItem>)
				}
			</Menu>
		</div >
	);

}

export default FontSize;
