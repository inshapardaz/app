/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';

const ProfileDropDown = ({ selectedProfile, onChange }) => {
  const intl = useIntl();
  const profiles = [{
    value: 'autocorrect',
    name: intl.formatMessage({ id: 'corrections.profile.autoCorrect' }),
  }, {
    value: 'punctuation',
    name: intl.formatMessage({ id: 'corrections.profile.punctuation' }),
  }];

  const anchorRef = React.useRef(null);
  const [profile, setProfile] = React.useState(profiles.find((x) => x.value === selectedProfile));
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  };

  const selectProfile = (p) => {
    handleClose();
    setProfile(p);
    onChange(p.value);
  };

  const profilesMenu = (
    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {profiles.map((p) => (
                  <MenuItem
                    key={p.value}
                    data-ft={`profile-${p.value}`}
                    selected={profile !== null && profile.value === p.value}
                    onClick={() => selectProfile(p)}
                  >
                    {p.name}
                  </MenuItem>
                ))}
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
        variant="outlined"
        onClick={handleToggle}
        startIcon={<SpellcheckIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        { profile !== null ? profile.name : <FormattedMessage id="correction.profile.label" /> }
      </Button>
      {profilesMenu}
    </>
  );
};

ProfileDropDown.defaultProps = {
  selectedProfile: null,
  onChange: () => {},
};

ProfileDropDown.propTypes = {
  selectedProfile: PropTypes.string,
  onChange: PropTypes.func,
};
export default ProfileDropDown;
