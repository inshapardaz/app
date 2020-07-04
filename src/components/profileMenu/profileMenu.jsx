/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import { fade, makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '../../react-auth0-spa';

// const useStyles = makeStyles((theme) => ({
// 	menuButton : {
// 	  marginRight : theme.spacing(2)
// 	},
// 	title : {
// 	  display : 'none',
// 	  [theme.breakpoints.up('sm')] : {
// 			display : 'block'
// 	  }
// 	},
// 	search : {
// 	  position : 'relative',
// 	  borderRadius : theme.shape.borderRadius,
// 	  backgroundColor : fade(theme.palette.common.white, 0.15),
// 	  '&:hover' : {
// 			backgroundColor : fade(theme.palette.common.white, 0.25)
// 	  },
// 	  marginRight : theme.spacing(2),
// 	  marginLeft : 0,
// 	  width : '100%',
// 	  [theme.breakpoints.up('sm')] : {
// 			marginLeft : theme.spacing(3),
// 			width : 'auto'
// 	  }
// 	},
// 	searchIcon : {
// 	  padding : theme.spacing(0, 2),
// 	  height : '100%',
// 	  position : 'absolute',
// 	  pointerEvents : 'none',
// 	  display : 'flex',
// 	  alignItems : 'center',
// 	  justifyContent : 'center'
// 	},
// 	inputRoot : {
// 	  color : 'inherit'
// 	},
// 	inputInput : {
// 	  padding : theme.spacing(1, 1, 1, 0),
// 	  // vertical padding + font size from searchIcon
// 	  paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
// 	  transition: theme.transitions.create('width'),
// 	  width: '100%',
// 	  [theme.breakpoints.up('md')]: {
// 		width: '20ch',
// 	  },
// 	},
// 	sectionDesktop: {
// 	  display: 'none',
// 	  [theme.breakpoints.up('md')]: {
// 		display: 'flex',
// 	  },
// 	},
// 	sectionMobile: {
// 	  display: 'flex',
// 	  [theme.breakpoints.up('md')]: {
// 		display: 'none',
// 	  },
// 	},
//   }));

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
		return (<div>Loading...</div>);
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
				<Avatar alt={displayName}
					src={avatar}
					ref={anchorRef}
					onClick={handleToggle}/>
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
				<IconButton
					edge="end"
					aria-label="account of current user"
					aria-controls="login"
					aria-haspopup="true"
					onClick={handleToggle}
					ref={anchorRef}
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
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
