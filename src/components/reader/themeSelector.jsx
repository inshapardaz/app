import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ColorLensIcon from '@mui/icons-material/ColorLens';

const themes = [{
  name: 'default',
  style: {
    color: 'black',
  },
  background: {
    top: 'url("/images/bookTop.png")',
    middle: 'url("/images/bookMiddle.png")',
    bottom: 'url("/images/bookBottom.png")',
    topLeft: 'url("/images/bookSingleTopLeft.png")',
    middleLeft: 'url("/images/bookSingleMiddleLeft.png")',
    bottomLeft: 'url("/images/bookSingleBottomLeft.png")',
    topRight: 'url("/images/bookSingleTopRight.png")',
    middleRight: 'url("/images/bookSingleMiddleRight.png")',
    bottomRight: 'url("/images/bookSingleBottomRight.png")',
  },
}, {
  name: 'sepia',
  style: {
    color: '#5B4636',
  },
  background: {
    top: 'url("/images/book1.png")',
    middle: 'url("/images/book2.png")',
    bottom: 'url("/images/book3.png")',
    topLeft: 'url("/images/bookSingleTopLeft.png")',
    middleLeft: 'url("/images/bookSingleMiddleLeft.png")',
    bottomLeft: 'url("/images/bookSingleBottomLeft.png")',
    topRight: 'url("/images/bookSingleTopRight.png")',
    middleRight: 'url("/images/bookSingleMiddleRight.png")',
    bottomRight: 'url("/images/bookSingleBottomRight.png")',
  },
}, {
  name: 'dark',
  style: {
    color: '#EEEEEE',
  },
  background: {
    top: 'url("/images/book1.png")',
    middle: 'url("/images/book2.png")',
    bottom: 'url("/images/book3.png")',
    topLeft: 'url("/images/bookSingleTopLeft.png")',
    middleLeft: 'url("/images/bookSingleMiddleLeft.png")',
    bottomLeft: 'url("/images/bookSingleBottomLeft.png")',
    topRight: 'url("/images/bookSingleTopRight.png")',
    middleRight: 'url("/images/bookSingleMiddleRight.png")',
    bottomRight: 'url("/images/bookSingleBottomRight.png")',
  },
}];

const getThemeFromName = (name) => themes.find((t) => t.name === name);

const getSelectedTheme = () => {
  const theme = localStorage.getItem('reader.theme');
  if (theme) {
    return getThemeFromName(theme);
  }
  return themes[0];
};

const ThemeSelector = ({ open, onClose }) => {
  const selectedTheme = getSelectedTheme();

  const onChange = (newTheme) => {
    localStorage.setItem('reader.theme', newTheme.name);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <ColorLensIcon />
        <FormattedMessage id="theme" />
      </DialogTitle>
      <List sx={{ pt: 0, minWidth: 200 }}>
        {themes.map((t) => (
          <ListItemButton
            key={t.name}
            selected={t.name === selectedTheme}
            onClick={() => onChange(t)}
          >
            <ListItemText primary={<FormattedMessage id={`theme.${t.name}`} />} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

ThemeSelector.defaultProps = {
  open: false,
  onClose: () => {},
};

ThemeSelector.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export { getSelectedTheme, getThemeFromName };
export default ThemeSelector;
