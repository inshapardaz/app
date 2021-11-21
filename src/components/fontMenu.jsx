import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import { localeService } from '@/services/';

const FontMenu = ({
  value, onFontSelected, storageKey, variant, size,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const fonts = localeService.getSupportedFonts();
  const [font, setFont] = useState(null);

  useEffect(() => {
    const selectedFont = fonts.find((f) => f.key === value);
    if (selectedFont !== undefined) {
      setFont(selectedFont);
      localStorage.setItem(storageKey, selectedFont.key);
    }
  }, [value]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelected = (f) => {
    onFontSelected(f.key);
    if (storageKey) {
      localStorage.setItem(storageKey, f.key);
    }
    handleClose();
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant={variant}
        size={size}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {font ? font.displayName : <FormattedMessage id="chapter.toolbar.font" /> }
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {fonts.map((f) => (
          <MenuItem
            key={f.key}
            onClick={() => onSelected(f)}
            value={f.key}
            selected={value === f.key}
          >
            {f.displayName}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

FontMenu.defaultProps = {
  value: '',
  storageKey: '',
  variant: 'outlined',
  size: 'medium',
  onFontSelected: () => {},
};

FontMenu.propTypes = {
  value: PropTypes.string,
  storageKey: PropTypes.string,
  onFontSelected: PropTypes.func,
  variant: PropTypes.string,
  size: PropTypes.string,
};

export default FontMenu;
