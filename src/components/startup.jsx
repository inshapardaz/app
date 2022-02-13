import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

// MUI
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Local Imports
import actions from '@/actions';

const Startup = ({ children }) => {
  const dispatch = useDispatch();
  const init = useSelector((state) => state.accountReducer.init);
  const user = useSelector((state) => state.accountReducer.user);
  const entryFetched = useSelector((state) => state.libraryReducer.entryFetched);

  useEffect(() => {
    dispatch(actions.initaliseUI());
    dispatch(actions.initializeAuth())
      .then(() => {
        dispatch(actions.getEntry());
      })
      .catch(() => {});
  }, []);

  if (init && (!user || entryFetched)) {
    return children;
  }
  return (
    <Backdrop
      data-ft="page-loading"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

Startup.defaultProps = {
  children: null,
};
Startup.propTypes = {
  children: PropTypes.node,
};

export default Startup;
