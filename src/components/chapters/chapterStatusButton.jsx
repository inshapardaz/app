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
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const ChapterStatusButton = ({
  chapter, onUpdating, onUpdated, onClose, button,
}) => {
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

  if (button) {
    return (
      <ButtonWithTooltip
        disabled={chapter === null}
        onClick={handleClick}
        variant="outlined"
        size="large"
        tooltip={<FormattedMessage id="pages.setStatus" />}
        endIcon={<InfoOutlinedIcon fontSize="small" />}
      >
        <ChapterStatusDialog chapter={chapter} onUpdating={onUpdating} onUpdated={handleUpdate} onClose={handleClose} open={open} />
      </ButtonWithTooltip>
    );
  }

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
      <ChapterStatusDialog chapter={chapter} onUpdating={onUpdating} onUpdated={handleUpdate} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ChapterStatusButton.defaultProps = {
  chapter: null,
  button: false,
  onUpdating: () => {},
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
  button: PropTypes.func,
  onUpdating: PropTypes.func,
  onUpdated: PropTypes.func,
  onClose: PropTypes.func,
};

export default ChapterStatusButton;
