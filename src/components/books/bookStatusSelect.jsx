import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useIntl } from "react-intl";
import BookStatus from '../../models/bookStatus';

const BookStatusDropDown = ({ value, onStatusSelected }) => {
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const onItemClicked = (status) => {
		console.log(`new status is : ${status}`);

		if (status !== null && onStatusSelected !== null) {
			onStatusSelected(status)
		}
		handleClose();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const renderMenuItems = () => {
		let menuItems = [];
		for (var status in BookStatus) {
			menuItems.push(<MenuItem key={status} onClick={() => onItemClicked(status)}>{intl.formatMessage({ id: `book.status.${BookStatus[status]}` })}</MenuItem>);
		}

		return menuItems;
	}
	console.log(`value : ${value}`);
	return (
		<div>
			<Button aria-controls="chapters-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
				{intl.formatMessage({ id: `book.status.${BookStatus[value]}` })}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			> {renderMenuItems()}
			</Menu>
		</div>
	);
};

export default BookStatusDropDown;
