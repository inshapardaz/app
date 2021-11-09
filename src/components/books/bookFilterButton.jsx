import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CommentIcon from '@mui/icons-material/Comment';
import RateReviewIcon from '@mui/icons-material/RateReview';

const BookFilterButton = ({
  favorite, read, statusFilter, onChange, showStatusFilter = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onFilterCleared = () => {
    onChange(false, null, 'published');
  };

  const onFavoriteChanged = () => {
    onChange(!favorite, read, statusFilter);
  };

  const onReadFilter = () => {
    onChange(favorite, true, statusFilter);
  };

  const onUnreadFilter = () => {
    onChange(favorite, false, statusFilter);
  };

  const onStatusFilter = (newFilter) => {
    if (newFilter !== statusFilter) {
      onChange(favorite, read, newFilter);
    }
  };

  const renderStatusFilter = () => {
    if (showStatusFilter) {
      return (
        <div>
          <Divider />
          <ListSubheader>
            <FormattedMessage id="book.status.filter.title" />
          </ListSubheader>
          <MenuItem
            selected={statusFilter === 'published'}
            onClick={() => onStatusFilter('published')}
          >
            <ListItemIcon><CloudDoneIcon /></ListItemIcon>
            <FormattedMessage id="book.status.Published" />
          </MenuItem>
          <MenuItem
            selected={statusFilter === 'availableForTyping'}
            onClick={() => onStatusFilter('availableForTyping')}
          >
            <ListItemIcon><HourglassEmptyIcon /></ListItemIcon>
            <FormattedMessage id="book.status.AvailableForTyping" />
          </MenuItem>
          <MenuItem
            selected={statusFilter === 'beingTyped'}
            onClick={() => onStatusFilter('beingTyped')}
          >
            <ListItemIcon><KeyboardIcon /></ListItemIcon>
            <FormattedMessage id="book.status.BeingTyped" />
          </MenuItem>
          <MenuItem
            selected={statusFilter === 'readyForProofRead'}
            onClick={() => onStatusFilter('readyForProofRead')}
          >
            <ListItemIcon><CommentIcon /></ListItemIcon>
            <FormattedMessage id="book.status.ReadyForProofRead" />
          </MenuItem>
          <MenuItem
            selected={statusFilter === 'proofRead'}
            onClick={() => onStatusFilter('proofRead')}
          >
            <ListItemIcon><RateReviewIcon /></ListItemIcon>
            <FormattedMessage id="book.status.ProofRead" />
          </MenuItem>
        </div>
      );
    }

    return null;
  };
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
        <MenuItem onClick={onFavoriteChanged} selected={favorite}>
          <ListItemIcon><FavoriteIcon /></ListItemIcon>
          <FormattedMessage id="books.filters.favorite" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={onReadFilter} selected={read === true}>
          <ListItemIcon><ChromeReaderModeIcon /></ListItemIcon>
          <FormattedMessage id="books.filters.read" />
        </MenuItem>
        <MenuItem onClick={onUnreadFilter} selected={read === false}>
          <ListItemIcon><ChromeReaderModeOutlinedIcon /></ListItemIcon>
          <FormattedMessage id="books.filters.unread" />
        </MenuItem>
        { renderStatusFilter() }
        <Divider />
        <MenuItem onClick={onFilterCleared}>
          <ListItemIcon />
          <FormattedMessage id="books.filters.none" />
        </MenuItem>
      </Menu>
    </>
  );
};

BookFilterButton.defaultProps = {
  favorite: false,
  read: null,
  statusFilter: 'published',
  showStatusFilter: false,
  onChange: () => {},
};

BookFilterButton.propTypes = {
  favorite: PropTypes.bool,
  read: PropTypes.bool,
  statusFilter: PropTypes.string,
  showStatusFilter: PropTypes.bool,
  onChange: PropTypes.func,
};
export default BookFilterButton;
