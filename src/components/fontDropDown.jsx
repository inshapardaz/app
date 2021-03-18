import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FontDownloadIcon from '@material-ui/icons/FontDownload';
import { useIntl, FormattedMessage } from "react-intl";

const getFonts = (intl) => [
	{
		key: "Nafees Web Naskh",
		value: intl.formatMessage({ id: "font.NafeesWebNaskh" })
	},
	{
		key: "Mehr-Nastaleeq",
		value: intl.formatMessage({ id: "font.MehrNastaleeq" })
	},
	{
		key: "AdobeArabic",
		value: intl.formatMessage({ id: "font.AdobeArabic" })
	},
	{
		key: "Dubai",
		value: intl.formatMessage({ id: "font.Dubai" })
	},
	{
		key: "Noto",
		value: intl.formatMessage({ id: "font.Noto" })
	},
	{
		key: "Jameel Noori Nastaleeq",
		value: intl.formatMessage({ id: "font.JameelNooriNastaleeq" })
	},
	{
		key: "SegoeUIL",
		value: intl.formatMessage({ id: "font.SegoeUILight" })
	}
];

const FontDropdown = ({ value, onFontSelected, storageKey }) => {
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const fonts = getFonts(intl);
	const [font, setFont] = useState(null);

	useEffect(() => {
		let selectedFont = fonts.find(f => f.key === value);
		if (selectedFont !== undefined) {
			setFont(selectedFont);
			localStorage.setItem(storageKey, selectedFont.key);
		}
	}, [value]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const onSelected = (f) => {
		setFont(f);
		onFontSelected && onFontSelected(f.key);
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
			<Button aria-controls="chapters-menu" aria-haspopup="true" onClick={handleClick} startIcon={<FontDownloadIcon />} endIcon={<ExpandMoreIcon />}>
				{font !== null ? font.value : intl.formatMessage({ id: "font.none" })}
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
					fonts.map(f => <MenuItem key={f.key} onClick={() => onSelected(f)} value={f.key}>{f.value}</MenuItem>)
				}
			</Menu>
		</div >
	);

}

export default FontDropdown;
