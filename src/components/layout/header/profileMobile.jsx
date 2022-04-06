/* eslint-disable no-script-url */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import LoginIcon from '@mui/icons-material/Login';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FaceIcon from '@mui/icons-material/Face';

// Local Import
import actions from '@/actions';

const ProfileMobileMenu = ({ onClick, onKeyDown }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);

  if (!user) {
    return (
      <>
        <ListItem button key="login" component={Link} to="/account/login">
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="login" />} />
        </ListItem>
      </>
    );
  }

  return (
    <>
      <ListItem button key="profile" component={Link} to="/profile" data-ft="profile-link" onClick={onClick} onKeyDown={onKeyDown}>
        <ListItemIcon>
          <FaceIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="header.profile" />} />
      </ListItem>
      <ListItem button key="change-password" component={Link} to="/account/change-password" data-ft="change-password-link" onClick={onClick} onKeyDown={onKeyDown}>
        <ListItemIcon>
          <LockOpenIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="changePassword.title" />} />
      </ListItem>
      {user.isSuperAdmin && <Divider />}
      {user.isSuperAdmin && (
      <ListItem button key="admin" component={Link} to="/admin/libraries" data-ft="admin-link" onClick={onClick} onKeyDown={onKeyDown}>
        <ListItemIcon>
          <SupervisorAccountIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="header.administration" />} />
      </ListItem>
      )}
      {user.isSuperAdmin && (
      <ListItem button key="admin" component={Link} to="/tools/corrections" data-ft="corrections-link" onClick={onClick} onKeyDown={onKeyDown}>
        <ListItemIcon>
          <SpellcheckIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="correction.profile.label" />} />
      </ListItem>
      )}
      <Divider />
      <ListItemButton key="logout" onClick={() => { dispatch(actions.logoutAction()); onClick(); }} data-ft="logout-link" onKeyDown={onKeyDown}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="logout" />} />
      </ListItemButton>
    </>
  );
};

ProfileMobileMenu.defaultProps = {
  onClick: () => {},
  onKeyDown: () => {},
};

ProfileMobileMenu.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default ProfileMobileMenu;
