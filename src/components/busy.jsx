import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Busy = ({ busy, children }) => {
  if (busy) {
    return (
      <>
        <Backdrop
          data-ft="loading-backdrop"
          open
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  }
  return children || null;
};

Busy.defaultProps = {
  children: null,
};
Busy.propTypes = {
  busy: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default Busy;
