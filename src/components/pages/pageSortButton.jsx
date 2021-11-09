import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const PageSortButton = ({ sortDirection = 'ascending', onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickSortDirection = (newSortDirection) => {
    if (newSortDirection !== sortDirection && onChange) {
      onChange(newSortDirection);
    }
  };

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="books.label.sort" />}
        onClick={handleClick}
      >
        <SortIcon sx={{ color: sortDirection !== 'ascending' ? 'primary.main' : 'text.secondary' }} />
      </ButtonWithTooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem selected={sortDirection === 'ascending'} onClick={() => onClickSortDirection('ascending')}>
          <ListItemIcon><ArrowUpwardIcon /></ListItemIcon>
          <FormattedMessage id="action.zoom.ascending" />
        </MenuItem>
        <MenuItem selected={sortDirection === 'descending'} onClick={() => onClickSortDirection('descending')}>
          <ListItemIcon><ArrowDownwardIcon /></ListItemIcon>
          <FormattedMessage id="action.zoom.descending" />
        </MenuItem>
      </Menu>
    </>
  );
};

PageSortButton.defaultProps = {
  sortDirection: 'ascending',
  onChange: () => {},
};

PageSortButton.propTypes = {
  sortDirection: PropTypes.string,
  onChange: PropTypes.func,
};

export default PageSortButton;
