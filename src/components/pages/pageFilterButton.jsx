import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CommentIcon from '@mui/icons-material/Comment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Local Import
import PageStatus from '@/models/pageStatus';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const getPageCountInStatus = (book, status) => {
  if (book && book.pageStatus) {
    const stat = book.pageStatus.find((s) => s.status === status);

    if (stat) {
      return stat.count;
    }

    return 0;
  }

  return null;
};

const PageFilterButton = ({
  book, statusFilter, assignmentFilter, onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onStatusFilter = (newFilter) => {
    if (newFilter !== statusFilter) {
      onChange(newFilter, assignmentFilter);
    }
  };

  const onAssignmentFilter = (newFilter) => {
    if (newFilter !== assignmentFilter) {
      onChange(statusFilter, newFilter);
    }
  };

  if (!book) return null;

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="books.label.filter" />}
        onClick={handleClick}
      >
        <FilterAltIcon />
      </ButtonWithTooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem
          selected={assignmentFilter === 'all'}
          onClick={() => onAssignmentFilter('all')}
        >
          <ListItemIcon><FileCopyIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="page.assign.all" />
          </ListItemText>
        </MenuItem>
        <MenuItem
          selected={assignmentFilter === 'assignedToMe'}
          onClick={() => onAssignmentFilter('assignedToMe')}
        >
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="page.assign.assignedToMe" />
          </ListItemText>
        </MenuItem>

        <MenuItem
          selected={assignmentFilter === 'assigned'}
          onClick={() => onAssignmentFilter('assigned')}
        >
          <ListItemIcon><PeopleAltIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="page.assign.assigned" />
          </ListItemText>
        </MenuItem>

        <MenuItem
          selected={assignmentFilter === 'unassigned'}
          onClick={() => onAssignmentFilter('unassigned')}
        >
          <ListItemIcon><PersonOutlineIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="page.assign.unassigned" />
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          selected={statusFilter === PageStatus.All}
          onClick={() => onStatusFilter(PageStatus.All)}
        >
          <ListItemIcon />
          <FormattedMessage id="books.filters.none" />
        </MenuItem>
        <MenuItem
          selected={statusFilter === PageStatus.AvailableForTyping}
          onClick={() => onStatusFilter(PageStatus.AvailableForTyping)}
        >
          <ListItemIcon><HourglassEmptyIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="book.status.AvailableForTyping" />
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {getPageCountInStatus(book, PageStatus.AvailableForTyping)}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={statusFilter === PageStatus.Typing}
          onClick={() => onStatusFilter(PageStatus.Typing)}
        >
          <ListItemIcon><KeyboardIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="book.status.BeingTyped" />
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {getPageCountInStatus(book, PageStatus.Typing)}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={statusFilter === PageStatus.Typed}
          onClick={() => onStatusFilter(PageStatus.Typed)}
        >
          <ListItemIcon><CommentIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="book.status.ReadyForProofRead" />
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {getPageCountInStatus(book, PageStatus.Typed)}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={statusFilter === PageStatus.InReview}
          onClick={() => onStatusFilter(PageStatus.InReview)}
        >
          <ListItemIcon><RateReviewIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="book.status.ProofRead" />
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {getPageCountInStatus(book, PageStatus.InReview)}
          </Typography>
        </MenuItem>
        <MenuItem
          selected={statusFilter === PageStatus.Completed}
          onClick={() => onStatusFilter(PageStatus.Completed)}
        >
          <ListItemIcon><DoneIcon /></ListItemIcon>
          <ListItemText>
            <FormattedMessage id="book.status.Completed" />
          </ListItemText>
          <Typography variant="body2" color="text.secondary">
            {getPageCountInStatus(book, PageStatus.Completed)}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

PageFilterButton.defaultProps = {
  book: null,
  statusFilter: PageStatus.Typing,
  assignmentFilter: 'assignedToMe',
  onChange: () => {},
};

PageFilterButton.propTypes = {
  book: PropTypes.shape({
    pageStatus: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.string,
      count: PropTypes.number,
    })),
  }),
  statusFilter: PropTypes.string,
  assignmentFilter: PropTypes.string,
  onChange: PropTypes.func,
};

export default PageFilterButton;
