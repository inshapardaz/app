import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';

// MUI
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const lineWidths = [{
  name: 'narrow',
  value: 1.0,
}, {
  name: 'normal',
  value: 1.2,
}, {
  name: 'wide',
  value: 1.5,
}, {
  name: 'wider',
  value: 2.0,
}, {
  name: 'widest',
  value: 2.5,
}];

const LineHeightSelector = ({ open, onClose }) => {
  const selectedLineHeight = useLocalStorage('reader.lineHeight', 1.0);

  const onChange = (newLineHeight) => {
    writeStorage('reader.lineHeight', newLineHeight.value);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        <FormatLineSpacingIcon />
        <FormattedMessage id="lineHeight" />
      </DialogTitle>
      <List sx={{ pt: 0, minWidth: 200 }}>
        {lineWidths.map((w) => (
          <ListItemButton
            key={w.name}
            selected={w.value === selectedLineHeight}
            onClick={() => onChange(w)}
          >
            <ListItemText primary={<FormattedMessage id={`lineHeight.${w.name}`} />} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
};

LineHeightSelector.defaultProps = {
  open: false,
  onClose: () => {},
};

LineHeightSelector.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default LineHeightSelector;
