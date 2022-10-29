import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import { red, green, orange } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import PublicIcon from '@mui/icons-material/Public';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
// Local imports

const CopyrightIcon = ({ status }) => {
  switch (status) {
    case 'Copyright':
      return (<Tooltip title={<FormattedMessage id="copyrights.Copyright" />}><SecurityIcon fontSize="small" sx={{ color: red[500] }} /></Tooltip>);
    case 'PublicDomain':
      return (<Tooltip title={<FormattedMessage id="copyrights.PublicDomain" />}><PublicOutlinedIcon fontSize="small" sx={{ color: green[500] }} /></Tooltip>);
    case 'Open':
      return (<Tooltip title={<FormattedMessage id="copyrights.Open" />}><PublicIcon fontSize="small" sx={{ color: green[500] }} /></Tooltip>);
    case 'CreativeCommons':
      return (<Tooltip title={<FormattedMessage id="copyrights.CreativeCommons" />}><ClosedCaptionOutlinedIcon fontSize="small" sx={{ color: orange[500] }} /></Tooltip>);
    default:
      return (<Tooltip title={<FormattedMessage id="copyrights.Unknown" />}><GppMaybeOutlinedIcon fontSize="small" /></Tooltip>);
  }
};

CopyrightIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

export default CopyrightIcon;
