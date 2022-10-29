import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Box from '@mui/material/Box';

const TabPanel = (props) => {
  const {
    children, value, index, id, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={id}
      aria-labelledby={id}
      {...other}
    >
      {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
      )}
    </div>
  );
};

TabPanel.defaultProps = {
  children: null,
};
TabPanel.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default TabPanel;
