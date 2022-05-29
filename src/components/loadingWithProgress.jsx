import React from 'react';
import PropTypes from 'prop-types';

// MUI
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LoadingWithProgress = ({ value }) => {
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress variant="determinate" />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" color="text.secondary">
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  </Box>;
};

LoadingWithProgress.defaultProps = {
  value: 0,
};
LoadingWithProgress.propTypes = {
  value: PropTypes.number,
};

export default LoadingWithProgress;
