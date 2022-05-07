import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';

// MUI
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

// Local Imports
import { localeService } from '@/services/';

const FontSelector = ({ open, onClose }) => {
  const fonts = localeService.getSupportedFonts();
  const [selectedFont] = useLocalStorage('reader.font', 'MehrNastaleeq');

  const onChange = (newFont) => {
    writeStorage('reader.font', newFont.key);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FontDownloadIcon />
        <FormattedMessage id="chapter.toolbar.font" />
      </DialogTitle>
      <List sx={{ pt: 0, minWidth: 200 }}>
        {fonts.map((f) => (
          <ListItemButton
            key={f.key}
            selected={f.key === selectedFont}
            onClick={() => onChange(f)}
          >
            <ListItemText primary={f.displayName} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

FontSelector.defaultProps = {
  open: false,
  onClose: () => {},
};

FontSelector.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default FontSelector;
