/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import CategoryIcon from '@material-ui/icons/Category';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import LibraryService from '../../services/LibraryService';

function CategorySelector ()
{
	const [categories, setCategories] = useState(null);
	const anchorRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);

	useEffect(() =>
	{
		const fetchData = async () =>
		{
			const data = await LibraryService.getCategories();
			setCategories(data);
		};
		fetchData();
	}, []);

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
		if (categories && categories.data)
		{
			let cats = categories.data.map(c => (
				<MenuItem key={c.id} onClick={handleClose} component={Link} to={`/books?category=${c.id}`}>{c.name}</MenuItem>
			));

			if (categories.links.create)
			{
				cats.push(<Divider key="categories-divider" />);
				cats.push(<MenuItem key="categories-page" onClick={handleClose} component={Link} to={'/categories'}><FormattedMessage id="header.categories" /></MenuItem>);
				cats.push(<MenuItem key="create-category" onClick={handleClose} component={Link} to={'/category/new'}><FormattedMessage id="categories.action.create" /></MenuItem>);
			}
			return cats;
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

export default CategorySelector;
