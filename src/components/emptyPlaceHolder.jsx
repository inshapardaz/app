import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const EmptyPlaceholder = ({ title, actionText, onAction }) => (
  <Grid container sx={{ height: 300, alignSelf: 'center' }}>
    <Typography variant="h5">
      { title }
      { onAction && (
      <Button disableElevation fullWidth onClick={() => onAction && onAction()}>
        {actionText}
      </Button>
      )}
    </Typography>
  </Grid>
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
