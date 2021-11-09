import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const PageSizeSelector = ({ pageSize, title, onPageSizeSelected }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const values = [12, 24, 48, 98];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlerPageSizeSelected = (newPageSize) => {
    onPageSizeSelected(newPageSize);
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {title || pageSize}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {values.map((v) => <MenuItem key={v} selected={pageSize === v} onClick={() => handlerPageSizeSelected(v)}>{v}</MenuItem>) }
      </Menu>
    </div>
  );
};

PageSizeSelector.defaultProps = {
  pageSize: 12,
  title: null,
  onPageSizeSelected: () => {},
};

PageSizeSelector.propTypes = {
  pageSize: PropTypes.number,
  title: PropTypes.node,
  onPageSizeSelected: PropTypes.func,
};
export default PageSizeSelector;
