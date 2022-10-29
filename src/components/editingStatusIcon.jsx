import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import Tooltip from '@mui/material/Tooltip';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CommentIcon from '@mui/icons-material/Comment';
import RateReviewIcon from '@mui/icons-material/RateReview';

// Local imports
import BookStatus from '@/models/bookStatus';

const EditingStatusIcon = ({ status, showIfPublished }) => {
  switch (status) {
    case BookStatus.AvailableForTyping:
      return (<Tooltip title={<FormattedMessage id="book.status.AvailableForTyping" />}><HourglassEmptyIcon /></Tooltip>);
    case BookStatus.BeingTyped:
      return (<Tooltip title={<FormattedMessage id="book.status.BeingTyped" />}><KeyboardIcon /></Tooltip>);
    case BookStatus.ReadyForProofRead:
      return (<Tooltip title={<FormattedMessage id="book.status.ReadyForProofRead" />}><CommentIcon /></Tooltip>);
    case BookStatus.ProofRead:
      return (<Tooltip title={<FormattedMessage id="book.status.ProofRead" />}><RateReviewIcon /></Tooltip>);
    case BookStatus.Published:
      return showIfPublished ? (<Tooltip title={<FormattedMessage id="book.status.Published" />}><CloudDoneIcon /></Tooltip>) : null;
    default:
      return null;
  }
};

EditingStatusIcon.defaultProps = {
  showIfPublished: false,
};
EditingStatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
  showIfPublished: PropTypes.bool,
};

export default EditingStatusIcon;
