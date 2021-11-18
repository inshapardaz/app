import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import { libraryService } from '@/services';
import PageStatus from '@/models/pageStatus';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const getStatusIcon = (status) => {
  switch (status) {
    case PageStatus.AvailableForTyping:
      return (<HourglassEmptyIcon />);
    case PageStatus.Typing:
      return (<KeyboardHideIcon />);
    case PageStatus.Typed:
      return (<SpellcheckIcon />);
    case PageStatus.InReview:
      return (<RateReviewIcon />);
    case PageStatus.Completed:
      return (<DoneIcon />);
    default:
      return null;
  }
};

const items = [];
// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(PageStatus)) {
  if (key !== 'All') items.push({ key, value });
}

const StatusButton = ({
  pages, onStatusChanges, onBusy,
}) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSelected = (newStatus) => {
    handleClose();
    onBusy(true);
    const promises = [];

    pages.map((page) => {
      if (page !== null && page !== undefined) {
        if (page.links.update) {
          page.status = newStatus;
          return promises.push(libraryService.updatePage(page.links.update, page));
        }
      }
      return Promise.resolve();
    });

    Promise.all(promises)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' }))
      .then(() => onBusy(false))
      .then(() => onStatusChanges())
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' }));
  };

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="pages.setStatus" />}
        disabled={pages.length < 1}
        onClick={handleClick}
        startIcon={<KeyboardArrowDownIcon />}
      >
        <InfoOutlinedIcon />
      </ButtonWithTooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.key}
            onClick={() => onSelected(item.key)}
            value={item.key}
          >
            <ListItemIcon>
              {getStatusIcon(item.value)}
            </ListItemIcon>
            {intl.formatMessage({ id: `status.${item.value}` })}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

StatusButton.defaultProps = {
  pages: null,
  onStatusChanges: () => {},
  onBusy: () => {},
};

StatusButton.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  })),
  onBusy: PropTypes.func,
  onStatusChanges: PropTypes.func,
};

export default StatusButton;
