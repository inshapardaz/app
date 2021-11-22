import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MUI
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

const getThemeFromName = (name) => themes.find((t) => t.name === name);

const getSelectedTheme = () => {
  const theme = localStorage.getItem('reader.theme');
  if (theme) {
    return getThemeFromName(theme);
  }
  return themes[0];
};

const ThemeSelector = ({ onThemeChanged }) => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getSelectedTheme());

  const handleClick = () => {
    setOpen(!open);
  };

  const onChange = (newTheme) => {
    localStorage.setItem('reader.theme', newTheme.name);
    setTheme(newTheme.name);
    onThemeChanged(newTheme);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ColorLensIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="theme" />} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {themes.map((t) => (
          <ListItemButton
            key={t.name}
            selected={t.name === theme}
            onClick={() => onChange(t)}
          >
            <ListItemText primary={<FormattedMessage id={`theme.${t.name}`} />} />
          </ListItemButton>
        ))}
      </Collapse>
    </>
  );
};

ThemeSelector.defaultProps = {
  onThemeChanged: () => {},
};

ThemeSelector.propTypes = {
  onThemeChanged: PropTypes.func,
};

export { getSelectedTheme, getThemeFromName };
export default ThemeSelector;
