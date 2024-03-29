import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

const isValueSelected = (filterValue, actualValue) => (filterValue ? filterValue.toUpperCase() === actualValue.toUpperCase() : false);

const PeriodicalSortButton = ({ sortBy, sortDirection, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickSort = (newSortBy) => {
    if (newSortBy !== sortBy && onChange) {
      onChange(newSortBy, sortDirection);
    }
  };

  const onClickSortDirection = (newSortDirection) => {
    if (newSortDirection !== sortDirection && onChange) {
      onChange(sortBy, newSortDirection);
    }
  };

  return (
    <>
      <Tooltip title={<FormattedMessage id="books.label.sort" />}>
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <SortIcon sx={{ color: sortBy !== 'title' || isValueSelected(sortDirection, 'descending') ? 'primary.main' : 'text.secondary' }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem selected={isValueSelected(sortBy, 'title')} onClick={() => onClickSort('title')}>
          <ListItemIcon><SortByAlphaIcon /></ListItemIcon>
          <FormattedMessage id="periodical.editor.fields.name.title" />
        </MenuItem>
        <Divider />
        <MenuItem selected={isValueSelected(sortDirection, 'ascending')} onClick={() => onClickSortDirection('ascending')}>
          <ListItemIcon><ArrowUpwardIcon /></ListItemIcon>
          <FormattedMessage id="action.zoom.ascending" />
        </MenuItem>
        <MenuItem selected={isValueSelected(sortDirection, 'descending')} onClick={() => onClickSortDirection('descending')}>
          <ListItemIcon><ArrowDownwardIcon /></ListItemIcon>
          <FormattedMessage id="action.zoom.descending" />
        </MenuItem>
      </Menu>
    </>
  );
};

PeriodicalSortButton.defaultProps = {
  sortBy: 'title',
  sortDirection: 'ascending',
  onChange: () => {},
};

PeriodicalSortButton.propTypes = {
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  onChange: PropTypes.func,
};

export default PeriodicalSortButton;
