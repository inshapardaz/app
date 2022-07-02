import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Imports
import ChapterStatusDialog from '@/components/chapters/chapterStatusDialog';

const ChapterStatusButton = ({ chapter, onUpdated, onClose }) => {
  const [open, setOpen] = useState(false);

  const handleUpdate = () => {
    setOpen(false);
    onUpdated();
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <MenuItem
      disabled={chapter === null}
      onClick={handleClick}
    >
      <ListItemIcon>
        <InfoOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id="pages.setStatus" />
      </ListItemText>
      <ChapterStatusDialog chapter={chapter} onUpdated={handleUpdate} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ChapterStatusButton.defaultProps = {
  chapter: null,
  onUpdated: () => {},
  onClose: () => {},
};

ChapterStatusButton.propTypes = {
  chapter: PropTypes.shape({
    chapterNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  onUpdated: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChapterStatusButton;
