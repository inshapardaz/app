import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// MUI
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TranslateIcon from '@mui/icons-material/Translate';
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Local Imports
import actions from '@/actions';
import { localeService } from '@/services';

const LanguageSwitcher = () => {
  const language = useSelector((state) => state.localeReducer.language);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const languages = localeService.getLanguages();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const setLanguage = (lang) => {
    handleClose();
    dispatch(actions.setLanguageAction(lang));
  };

  return (
    <>
      <IconButton
        id="language-button"
        data-ft="language-menu"
        aria-controls="language-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: (theme) => theme.palette.common.white }}
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        id="language-positioned-menu"
        aria-labelledby="language-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {languages.map((l) => (
          <MenuItem key={l.locale} data-ft={`language-${l.locale}`} selected={language === l.locale} onClick={() => setLanguage(l.locale)}>
            {language === l.locale && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            )}
            <ListItemText inset={language !== l.locale}>{l.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
