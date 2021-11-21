import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  const [value, setValue] = useState(parseFloat(localStorage.getItem('reader.lineHeight') || '1.0'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const selectedLineHeight = lineWidths.find((t) => t.value === value);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    onValueChanged(selectedLineHeight.value);
  }, [value]);

  const onChange = (newLineHeight) => {
    localStorage.setItem('reader.lineHeight', newLineHeight.value);
    setValue(newLineHeight.value);
    handleClose();
  };
  return (
    <>
      <Button
        id="lineHeight-button"
        aria-controls={open ? 'lineHeight-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
        startIcon={<FormatLineSpacingIcon fontSize="small" />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <FormattedMessage id={`lineHeight.${selectedLineHeight.name}`} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {lineWidths.map((w) => (
          <MenuItem
            key={w.name}
            value={w.name}
            selected={w.value === value}
            onClick={() => onChange(w)}
          >
            <FormattedMessage id={`lineHeight.${w.name}`} />
          </MenuItem>
        ))}
      </Menu>
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
