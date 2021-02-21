import React from 'react';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const DropDownMenu = ({ title, variant, children }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button saria-controls="drop-down-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
				{title}
			</Button>
			<Menu
				id="dropdown-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{children}
			</Menu>
		</div>
	);
};

export default DropDownMenu;
