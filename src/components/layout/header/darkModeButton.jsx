import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// MUI
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

// Local Imports
import actions from '@/actions';

const DarkModeButton = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.uiReducer.darkMode);

  return (
    <IconButton
      aria-label="uiMode"
      data-ft="dark-mode-toggle"
      onClick={() => dispatch(actions.setDarkMode(!isDarkMode))}
      sx={{ color: (theme) => theme.palette.common.white }}
    >
      { isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

export default DarkModeButton;
