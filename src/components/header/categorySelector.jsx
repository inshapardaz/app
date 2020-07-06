/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import CategoryIcon from '@material-ui/icons/Category';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

function CategorySelector (props)
{
	const anchorRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);

	const handleToggle = () =>
	{
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) =>
	{
		if (anchorRef.current && anchorRef.current.contains(event.target))
		{
		  return;
		}

		setOpen(false);
	};

	const handleListKeyDown  = (event) =>
	{
		if (event.key === 'Tab')
		{
		  event.preventDefault();
		  setOpen(false);
		}
	};

	const renderCategories = () =>
	{
		if (props.categories && props.categories.data)
		{
			return props.categories.data.map(c => (
				<MenuItem key={c.id} onClick={handleClose} component={Link} to={`/books?category=${c.id}`}>{c.name}</MenuItem>
			));
		}

		return null;
	};

	const langMenu = (
		<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{ transformOrigin : placement === 'bottom' ? 'center top' : 'center bottom' }}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
								{ renderCategories() }
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
	return (
		<>
			<Button
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggle}
				startIcon={<CategoryIcon />}
				endIcon={<KeyboardArrowDownIcon />}
			>
				<FormattedMessage id="header.categories" />
			</Button>
			{langMenu}
		</>
	);
}

export default (connect(
	(state) => ({
		categories : state.apiReducers.categories
	}),
	dispatch => bindActionCreators({
	}, dispatch)
)(CategorySelector));
