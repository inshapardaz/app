import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const ButtonWithTooltip = ({
  tooltip, disabled, onClick, ...other
}) => {
  const adjustedButtonProps = {
    disabled,
    component: disabled ? 'div' : undefined,
    onClick: disabled ? undefined : onClick,
  };
  return (
    <Tooltip title={tooltip}>
      <Button {...other} {...adjustedButtonProps} />
    </Tooltip>
  );
};

ButtonWithTooltip.defaultProps = {
  tooltip: null,
  disabled: false,
  onClick: () => {},
};

ButtonWithTooltip.propTypes = {
  tooltip: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ButtonWithTooltip;
