import React from 'react';
import PropTypes from 'prop-types';
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
import { localeService } from '@/services';

const LanguageDropDownButton = ({ selectedLanguage, onChange }) => {
  const languages = localeService.getLanguages();
  const anchorRef = React.useRef(null);
  const [lang, setLang] = React.useState(languages ? languages.find((x) => x.locale === selectedLanguage) : null);
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

  const selectLanguage = (l) => {
    handleClose();
    setLang(l);
    onChange(l.locale);
  };

  const languagesMenu = (
    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {languages.map((l) => (
                  <MenuItem
                    key={l.locale}
                    data-ft={`language-${l.locale}`}
                    selected={lang !== null && lang.locale === l.locale}
                    onClick={() => selectLanguage(l)}
                  >
                    {l.name}
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
        endIcon={<KeyboardArrowDownIcon />}
      >
        { lang !== null ? lang.name : <FormattedMessage id="language.placeholder" /> }
      </Button>
      {languagesMenu}
    </>
  );
};

LanguageDropDownButton.defaultProps = {
  selectedLanguage: null,
  onChange: () => {},
};

LanguageDropDownButton.propTypes = {
  selectedLanguage: PropTypes.string,
  onChange: PropTypes.func,
};
export default LanguageDropDownButton;
