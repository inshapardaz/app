/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import Avatar from '@material-ui/core/Avatar';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useAuth0 } from '@auth0/auth0-react';

const ProfileMenu = () =>
{
	// const classes = useStyles();

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

	const { loading, user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

	const displayName = user ? user.nickname : '';

	if (loading)
	{
		return null;
	}

	const onLogin = (event) =>
	{
		loginWithRedirect({});
		handleClose(event);
	};

	const onLogout = (event) =>
	{
		logout();
		handleClose(event);
	};

	let renderMenu = null;
	if (isAuthenticated)
	{
		const avatar = user.picture ? user.picture : '';
		renderMenu = (
			<>
				<Button
					edge="end"
					aria-label="account of current user"
					aria-controls="login"
					aria-haspopup="true"
					onClick={handleToggle}
					ref={anchorRef}
					color="inherit"
					startIcon={<Avatar src={avatar}/>}
					endIcon={<KeyboardArrowDownIcon />}
				>
				</Button>
				<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{ transformOrigin : placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
										<MenuItem >{displayName}</MenuItem>
										<MenuItem onClick={onLogout}><FormattedMessage id="logout" /></MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</>
		);
	}
	else
	{
		renderMenu = (
			<>
				<Button
					edge="end"
					aria-label="account of current user"
					aria-controls="login"
					aria-haspopup="true"
					onClick={handleToggle}
					ref={anchorRef}
					color="inherit"
					startIcon={<AccountCircle />}
					endIcon={<KeyboardArrowDownIcon />}
				>
				</Button>
				<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{ transformOrigin : placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
										<MenuItem onClick={handleClose}><FormattedMessage id="register" /></MenuItem>
										<MenuItem onClick={onLogin}><FormattedMessage id="login" /></MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</>
		);
	}

	return renderMenu;
};

export default injectIntl(ProfileMenu);
