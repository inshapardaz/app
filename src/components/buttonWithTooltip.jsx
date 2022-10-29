import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const ButtonWithTooltip = ({
  tooltip, disabled, iconButton = false, onClick, ...other
}) => {
  const adjustedButtonProps = {
    disabled,
    component: disabled ? 'div' : undefined,
    onClick: disabled ? undefined : onClick,
  };

  if (iconButton) {
    return (
      <Tooltip title={tooltip}>
        <IconButton {...other} {...adjustedButtonProps} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <Button {...other} {...adjustedButtonProps} />
    </Tooltip>
  );
};

ButtonWithTooltip.defaultProps = {
  tooltip: null,
  disabled: false,
  iconButton: false,
  onClick: () => {},
};

ButtonWithTooltip.propTypes = {
  tooltip: PropTypes.node,
  disabled: PropTypes.bool,
  iconButton: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ButtonWithTooltip;
