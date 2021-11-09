import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmptyPlaceholder = ({ title }) => (
  <Box sx={{ height: 300 }}>
    <Typography variant="h4">
      { title }
    </Typography>
  </Box>
);

EmptyPlaceholder.propTypes = {
  title: PropTypes.node.isRequired,
};

export default EmptyPlaceholder;
