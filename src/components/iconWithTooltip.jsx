import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';

const IconWithTooltip = ({ tooltip, text, icon }) => (
  <Tooltip title={tooltip}>
    <Chip
      label={text}
      avatar={icon}
      size="small"
    />
  </Tooltip>
);

IconWithTooltip.defaultProps = {
  text: null,
};

IconWithTooltip.propTypes = {
  tooltip: PropTypes.node.isRequired,
  text: PropTypes.node,
  icon: PropTypes.node.isRequired,
};

export default IconWithTooltip;
