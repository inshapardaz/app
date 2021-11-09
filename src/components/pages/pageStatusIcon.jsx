import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import { useTheme } from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import DoneIcon from '@mui/icons-material/Done';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import RateReviewIcon from '@mui/icons-material/RateReview';

// Local Import
import PageStatus from '@/models/pageStatus';

const PageStatusIcon = ({ status, invert = false, tooltip = true }) => {
  const theme = useTheme();
  const iconColor = invert ? theme.palette.background.paper : theme.palette.text.primary;

  if (tooltip) {
    switch (status) {
      case PageStatus.AvailableForTyping:
        return (
          <Tooltip title={<FormattedMessage id="status.Available" />}>
            <PhotoFilterIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
      case PageStatus.Typing:
        return (
          <Tooltip title={<FormattedMessage id="status.Typing" />}>
            <KeyboardIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
      case PageStatus.Typed:
        return (
          <Tooltip title={<FormattedMessage id="status.Typed" />}>
            <SpellcheckIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
      case PageStatus.InReview:
        return (
          <Tooltip title={<FormattedMessage id="status.InReview" />}>
            <RateReviewIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
      case PageStatus.Completed:
        return (
          <Tooltip title={<FormattedMessage id="status.Completed" />}>
            <DoneIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
      default:
        return (
          <Tooltip title={<FormattedMessage id="page.all" />}>
            <FileCopyIcon sx={{ color: iconColor }} />
          </Tooltip>
        );
    }
  }
  switch (status) {
    case PageStatus.AvailableForTyping:
      return (<PhotoFilterIcon sx={{ color: iconColor }} />);
    case PageStatus.Typing:
      return (<KeyboardIcon sx={{ color: iconColor }} />);
    case PageStatus.Typed:
      return (<KeyboardHideIcon sx={{ color: iconColor }} />);
    case PageStatus.InReview:
      return (<SpellcheckIcon sx={{ color: iconColor }} />);
    case PageStatus.Completed:
      return (<DoneIcon sx={{ color: iconColor }} />);
    default:
      return (<FileCopyIcon sx={{ color: iconColor }} />);
  }
};

PageStatusIcon.defaultProps = {
  status: null,
  tooltip: true,
  invert: false,
};

PageStatusIcon.propTypes = {
  status: PropTypes.string,
  tooltip: PropTypes.bool,
  invert: PropTypes.bool,
};

export default PageStatusIcon;
