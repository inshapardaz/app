/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import LocaleService from '../../services/LocaleService';

export default function LanguageSelector ()
{
	const locale = LocaleService.getCurrentLanguage();

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

	const chooseEnglish = (event) =>
	{
    	LocaleService.setCurrentLanguage('en');
		window.location.reload();
		handleClose(event);
	};

	const chooseUrdu = (event) =>
	{
    	LocaleService.setCurrentLanguage('ur');
		window.location.reload();
		handleClose(event);
	};

	const langMenu = (
		<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{ transformOrigin : placement === 'bottom' ? 'center top' : 'center bottom' }}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
								<MenuItem onClick={chooseEnglish} selected={locale === 'en'}>English</MenuItem>
								<MenuItem onClick={chooseUrdu} selected={locale === 'ur'}>اردو</MenuItem>
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
				endIcon={<KeyboardArrowDownIcon />}
			>
				{locale}
			</Button>
			{langMenu}
		</>
	);
}
