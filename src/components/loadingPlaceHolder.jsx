import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPlaceHolder = ({ title }) => (
  <Box sx={{ height: 300 }}>
    <Backdrop open>
      <CircularProgress color="inherit" />
      <Typography variant="h4">
        { title }
      </Typography>
    </Backdrop>
  </Box>
);

LoadingPlaceHolder.propTypes = {
  title: PropTypes.node.isRequired,
};

export default LoadingPlaceHolder;
