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
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const ChapterAssignButton = ({
  chapter, onAssigned, onAssigning, onClose, button,
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

  if (button) {
    return (
      <ButtonWithTooltip
        disabled={chapter === null}
        onClick={handleClick}
        variant="outlined"
        size="large"
        tooltip={<FormattedMessage id="chapter.action.assignToUser" />}
        startIcon={<PersonAddIcon fontSize="small" />}
      >
        <ChapterAssignDialog chapter={chapter} onUpdated={handleUpdate} onUpdating={onAssigning} onClose={handleClose} open={open} />
      </ButtonWithTooltip>
    );
  }
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
      <ChapterAssignDialog chapter={chapter} onUpdated={handleUpdate} onUpdating={onAssigning} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ChapterAssignButton.defaultProps = {
  chapter: null,
  button: false,
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
  button: PropTypes.bool,
  onAssigned: PropTypes.func,
  onAssigning: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChapterAssignButton;
