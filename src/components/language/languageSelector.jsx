/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import actions from '@/actions';
import { localeService } from '@/services';

export default function LanguageSelector() {
  const language = useSelector((state) => state.localeReducer.language);
  const dispatch = useDispatch();

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const languages = localeService.getLanguages();

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

  const setLanguage = (l) => {
    handleClose();
    dispatch(actions.setLanguageAction(l));
  };

  const langMenu = (
    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {languages.map((l) => (<MenuItem key={l.locale} data-ft={`language-${l.locale}`} selected={language === l.locale} onClick={() => setLanguage(l.locale)}>{l.name}</MenuItem>))}
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
        size="small"
        onClick={handleToggle}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <FormattedMessage id="language" />
      </Button>
      {langMenu}
    </>
  );
}
