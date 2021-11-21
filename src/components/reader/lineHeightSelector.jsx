import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Collapse from '@mui/material/Collapse';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';

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

const LineHeightSelector = ({ onValueChanged }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(parseFloat(localStorage.getItem('reader.lineHeight') || '1.0'));
  const selectedLineHeight = lineWidths.find((t) => t.value === value);

  useEffect(() => {
    onValueChanged(selectedLineHeight.value);
  }, [value]);

  const onChange = (newLineHeight) => {
    localStorage.setItem('reader.lineHeight', newLineHeight.value);
    setValue(newLineHeight.value);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <FormatLineSpacingIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="lineHeight" />} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {lineWidths.map((w) => (
          <ListItemButton
            key={w.name}
            selected={w.value === value}
            onClick={() => onChange(w)}
          >
            <ListItemText primary={<FormattedMessage id={`lineHeight.${w.name}`} />} />
          </ListItemButton>
        ))}
      </Collapse>
    </>
  );
};

LineHeightSelector.defaultProps = {
  onValueChanged: () => {},
};

LineHeightSelector.propTypes = {
  onValueChanged: PropTypes.func,
};

export default LineHeightSelector;
