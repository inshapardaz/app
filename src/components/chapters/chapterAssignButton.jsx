import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Imports
import ChapterAssignDialog from './chapterAssignDialog';

const ChapterAssignButton = ({
  chapter, onAssigned, onAssigning, onClose,
}) => {
  const [open, setOpen] = useState(false);

  const handleUpdate = () => {
    setOpen(false);
    onAssigned();
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
        <PersonAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id="chapter.action.assignToUser" />
      </ListItemText>
      <ChapterAssignDialog chapter={chapter} onUpdated={handleUpdate} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ChapterAssignButton.defaultProps = {
  chapter: null,
  onAssigned: () => {},
  onAssigning: () => {},
  onClose: () => {},
};

ChapterAssignButton.propTypes = {
  chapter: PropTypes.shape({
    chapterNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  onAssigned: PropTypes.func,
  onAssigning: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChapterAssignButton;
