/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { Role } from '../../helpers';
import { accountService } from '../../services';
import { Divider, ListItemIcon, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';

const ProfileMenu = () => {
	let subscription = null;
	const anchorRef = useRef(null);
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		subscription = accountService.user.subscribe(x => setUser(x));

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	if (!user) {
		return (
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
				<Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
										<MenuItem component={Link} onClick={handleClose} to='/account/register'><FormattedMessage id="register" /></MenuItem>
										<MenuItem component={Link} onClick={handleClose} to='/account/login'><FormattedMessage id="login" /></MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</>
		);
	}
	else {
		return (
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
				<Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
										<MenuItem component={Link} onClick={handleClose} to='/profile'>
											<ListItemIcon>
												<FaceIcon fontSize="small" />
											</ListItemIcon>
											<Typography variant="inherit" noWrap>
												<FormattedMessage id="header.profile" />
											</Typography>
										</MenuItem>
										<MenuItem component={Link} onClick={handleClose} to='/account/change-password'>
											<ListItemIcon>
												<LockOpenIcon fontSize="small" />
											</ListItemIcon>
											<Typography variant="inherit" noWrap>
												<FormattedMessage id="changePassword.title" />
											</Typography>
										</MenuItem>
										{user.role === Role.Admin &&
											<MenuItem component={Link} onClick={handleClose} to="/admin" >
												<ListItemIcon>
													<SupervisorAccountIcon fontSize="small" />
												</ListItemIcon>
												<Typography variant="inherit" noWrap>
													<FormattedMessage id="header.administration" />
												</Typography>
											</MenuItem>}
										<Divider />
										<MenuItem onClick={accountService.logout}>
											<ListItemIcon>
												<ExitToAppIcon fontSize="small" />
											</ListItemIcon>
											<Typography variant="inherit" noWrap>
												<FormattedMessage id="logout" />
											</Typography>
										</MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</>
		);
	}
};

export default injectIntl(ProfileMenu);
