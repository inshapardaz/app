/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import { Divider, ListItemIcon, Typography } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';

// Local Import
import actions from '@/actions';

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.accountReducer.user);

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
          data-ft="profile-menu"
          edge="end"
          aria-label="account of current user"
          aria-controls="login"
          aria-haspopup="true"
          onClick={handleToggle}
          ref={anchorRef}
          color="inherit"
          startIcon={<AccountCircleIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        />
        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
                    <MenuItem component={Link} onClick={handleClose} to="/account/login"><FormattedMessage id="login" /></MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }

  return (
    <>
      <Button
        data-ft="profile-menu"
        edge="end"
        aria-label="account of current user"
        aria-controls="login"
        aria-haspopup="true"
        onClick={handleToggle}
        ref={anchorRef}
        color="inherit"
        startIcon={<AccountCircleIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      />
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
                  <MenuItem component={Link} onClick={handleClose} to="/profile" data-ft="profile-link">
                    <ListItemIcon>
                      <FaceIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      <FormattedMessage id="header.profile" />
                    </Typography>
                  </MenuItem>
                  <MenuItem component={Link} onClick={handleClose} to="/account/change-password" data-ft="change-password-link">
                    <ListItemIcon>
                      <LockOpenIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      <FormattedMessage id="changePassword.title" />
                    </Typography>
                  </MenuItem>
                  {user.isSuperAdmin && (
                    <MenuItem component={Link} onClick={handleClose} to="/admin/libraries" data-ft="admin-link">
                      <ListItemIcon>
                        <SupervisorAccountIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit" noWrap>
                        <FormattedMessage id="header.administration" />
                      </Typography>
                    </MenuItem>
                  )}
                  {user.isSuperAdmin && (
                    <MenuItem component={Link} onClick={handleClose} to="/tools/corrections" data-ft="correction-link">
                      <ListItemIcon>
                        <SpellcheckIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography variant="inherit" noWrap>
                        <FormattedMessage id="correction.profile.label" />
                      </Typography>
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => dispatch(actions.logoutAction())} data-ft="logout-link">
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
};

export default ProfileMenu;
