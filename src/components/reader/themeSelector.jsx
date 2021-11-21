import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const themes = [{
  name: 'default',
  backgroundColor: 'white',
  color: 'black',
}, {
  name: 'sepia',
  backgroundColor: '#F4ECD8',
  color: '#5B4636',
}, {
  name: 'dark',
  backgroundColor: '#1C1b22',
  color: '#EEEEEE',
}];

const ThemeSelector = ({ onThemeChanged }) => {
  const [theme, setTheme] = useState(localStorage.getItem('reader.theme') || themes[0].name);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const selectedTheme = themes.find((t) => t.name === theme);
    onThemeChanged(selectedTheme);
  }, [theme]);

  const onChange = (newTheme) => {
    localStorage.setItem('reader.theme', newTheme.name);
    setTheme(newTheme.name);
    handleClose();
  };
  return (
    <>
      <Button
        id="theme-button"
        aria-controls={open ? 'theme-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
        startIcon={<ColorLensIcon fontSize="small" />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <FormattedMessage id={`theme.${theme}`} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {themes.map((t) => (
          <MenuItem
            key={t.name}
            value={t.name}
            selected={t.name === theme}
            onClick={() => onChange(t)}
          >
            <FormattedMessage id={`theme.${t.name}`} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ThemeSelector.defaultProps = {
  onThemeChanged: () => {},
};

ThemeSelector.propTypes = {
  onThemeChanged: PropTypes.func,
};

export default ThemeSelector;
