/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// MUI
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Check from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Local Imports
import actions from '@/actions';

export default function LibrarySelector() {
  const dispatch = useDispatch();
  const library = useSelector((state) => state.libraryReducer.library);
  const libraries = useSelector((state) => state.libraryReducer.entry);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const setLibrary = (l) => {
    handleClose();
    dispatch(actions.setSelectedLibrary(l));
  };

  const isSelectedLibrary = (l) => library && library.id === l.id;

  return (
    <>
      <IconButton
        id="library-button"
        data-ft="library-menu"
        aria-controls="library-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: (theme) => theme.palette.common.white }}
      >
        <LocalLibraryIcon />
      </IconButton>
      <Menu
        id="library-positioned-menu"
        aria-labelledby="library-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {libraries && libraries.data.map((l) => (
          <MenuItem key={l.id} data-ft={`library-${l.id}`} selected={isSelectedLibrary(l)} onClick={() => setLibrary(l)}>
            {isSelectedLibrary(l) && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
            )}
            <ListItemText inset={!isSelectedLibrary(l)}>{l.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
