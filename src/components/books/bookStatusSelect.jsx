import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useIntl } from "react-intl";

const BookStatusDropDown = ({ value, onStatusSelected }) => {
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const statuses = [{
		id: 0,
		key: 'Published',
		name: intl.formatMessage({ id: 'book.status.0' })
	}, {
		id: 1,
		key: 'AvailableForTyping',
		name: intl.formatMessage({ id: 'book.status.1' })
	}, {
		id: 2,
		key: 'BeingTyped',
		name: intl.formatMessage({ id: 'book.status.2' })
	}, {
		id: 3,
		key: 'ReadyForProofRead',
		name: intl.formatMessage({ id: 'book.status.3' })
	}, {
		id: 4,
		key: 'ProofRead',
		name: intl.formatMessage({ id: 'book.status.4' })
	}];

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const onItemClicked = (status) => {
		if (status !== null && onStatusSelected !== null) {
			onStatusSelected(status)
		}
		handleClose();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const renderMenuItem = (status) => {
		return (<MenuItem key={status.id} onClick={() => onItemClicked(status)}>{`${status.name}`}</MenuItem>);
	}

	const selectedStatus = statuses.find(s => s.key === value);
	return (
		<div>
			<Button aria-controls="chapters-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
				{selectedStatus ? selectedStatus.name : value}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			> {statuses.map(s => renderMenuItem(s))}
			</Menu>
		</div>
	);
};

export default BookStatusDropDown;
