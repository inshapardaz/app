import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const isFilterSelected = (filterValue, actualValue) => (filterValue ? filterValue.toUpperCase() === actualValue.toUpperCase() : false);

const PeriodicalFilterButton = ({
  frequencyFilter, onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onFrequencyFilter = (newFilter) => {
    if (newFilter !== frequencyFilter) {
      onChange(newFilter);
    }
  };

  const renderFrequencyFilter = () => (
    <div>
      <Divider />
      <ListSubheader>
        <FormattedMessage id="periodical.editor.fields.frequency.title" />
      </ListSubheader>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'All')}
        onClick={() => onFrequencyFilter('All')}
      >
        <FormattedMessage id="frequency.All" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Annually')}
        onClick={() => onFrequencyFilter('Annually')}
      >
        <FormattedMessage id="frequency.Annually" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Quarterly')}
        onClick={() => onFrequencyFilter('Quarterly')}
      >
        <FormattedMessage id="frequency.Quarterly" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Monthly')}
        onClick={() => onFrequencyFilter('Monthly')}
      >
        <FormattedMessage id="frequency.Monthly" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Fortnightly')}
        onClick={() => onFrequencyFilter('Fortnightly')}
      >
        <FormattedMessage id="frequency.Fortnightly" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Weekly')}
        onClick={() => onFrequencyFilter('Weekly')}
      >
        <FormattedMessage id="frequency.Weekly" />
      </MenuItem>
      <MenuItem
        selected={isFilterSelected(frequencyFilter, 'Daily')}
        onClick={() => onFrequencyFilter('Daily')}
      >
        <FormattedMessage id="frequency.Daily" />
      </MenuItem>
    </div>
  );
  return (
    <>
      <Tooltip title={<FormattedMessage id="books.label.filter" />}>
        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <FilterAltIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        { renderFrequencyFilter() }
      </Menu>
    </>
  );
};

PeriodicalFilterButton.defaultProps = {
  frequencyFilter: null,
  onChange: () => {},
};

PeriodicalFilterButton.propTypes = {
  frequencyFilter: PropTypes.string,
  onChange: PropTypes.func,
};
export default PeriodicalFilterButton;
