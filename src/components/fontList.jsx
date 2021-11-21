import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Local Imports
import { localeService } from '@/services/';

const FontList = ({
  value, onFontSelected, storageKey,
}) => {
  const [open, setOpen] = useState(false);
  const fonts = localeService.getSupportedFonts();

  useEffect(() => {
    const selectedFont = fonts.find((f) => f.key === value);
    if (selectedFont !== undefined) {
      localStorage.setItem(storageKey, selectedFont.key);
    }
  }, [value]);

  const handleClick = () => {
    setOpen(!open);
  };

  const onSelected = (f) => {
    onFontSelected(f.key);
    if (storageKey) {
      localStorage.setItem(storageKey, f.key);
    }
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FontDownloadIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="chapter.toolbar.font" />} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {fonts.map((f) => (
          <ListItemButton
            key={f.key}
            onClick={() => onSelected(f)}
            selected={value === f.key}
          >
            <ListItemText primary={f.displayName} />
          </ListItemButton>
        ))}
      </Collapse>
    </>
  );
};

FontList.defaultProps = {
  value: '',
  storageKey: '',
  onFontSelected: () => {},
};

FontList.propTypes = {
  value: PropTypes.string,
  storageKey: PropTypes.string,
  onFontSelected: PropTypes.func,
};

export default FontList;
