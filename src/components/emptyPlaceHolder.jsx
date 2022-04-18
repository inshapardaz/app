import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const EmptyPlaceholder = ({ title, actionText, onAction }) => (
  <Box sx={{ height: 300 }}>
    <Typography variant="h4">
      { title }
      { onAction && (
      <Button disableElevation fullWidth onClick={() => onAction && onAction()}>
        {actionText}
      </Button>
      )}
    </Typography>
  </Box>
);

EmptyPlaceholder.defaultProps = {
  onAction: null,
  actionText: null,
};

EmptyPlaceholder.propTypes = {
  title: PropTypes.node.isRequired,
  actionText: PropTypes.node,
  onAction: PropTypes.func,

};

export default EmptyPlaceholder;
