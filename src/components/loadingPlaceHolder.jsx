import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPlaceHolder = ({ busy, title, children }) => {
  if (!busy) {
    return children;
  }
  return (
    <Box sx={{
      position: 'relative',
      top: '50%',
      left: '50%',
    }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h4">
        {title}
      </Typography>
    </Box>
  );
};

LoadingPlaceHolder.defaultProps = {
  busy: false,
  title: '',
  children: null,
};

LoadingPlaceHolder.propTypes = {
  busy: PropTypes.bool,
  title: PropTypes.node,
  children: PropTypes.node,
};

export default LoadingPlaceHolder;
