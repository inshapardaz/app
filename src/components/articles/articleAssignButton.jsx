import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Imports
import ArticleAssignDialog from './articleAssignDialog';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const ArticleAssignButton = ({
  article, onAssigned, onAssigning, onClose, button,
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
        disabled={article === null}
        onClick={handleClick}
        variant="outlined"
        size="large"
        tooltip={<FormattedMessage id="chapter.action.assignToUser" />}
        startIcon={<PersonAddIcon fontSize="small" />}
      >
        <ArticleAssignDialog article={article} onUpdated={handleUpdate} onUpdating={onAssigning} onClose={handleClose} open={open} />
      </ButtonWithTooltip>
    );
  }
  return (
    <MenuItem
      disabled={article === null}
      onClick={handleClick}
    >
      <ListItemIcon>
        <PersonAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id="chapter.action.assignToUser" />
      </ListItemText>
      <ArticleAssignDialog article={article} onUpdated={handleUpdate} onUpdating={onAssigning} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ArticleAssignButton.defaultProps = {
  article: null,
  button: false,
  onAssigned: () => {},
  onAssigning: () => {},
  onClose: () => {},
};

ArticleAssignButton.propTypes = {
  article: PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  button: PropTypes.bool,
  onAssigned: PropTypes.func,
  onAssigning: PropTypes.func,
  onClose: PropTypes.func,
};

export default ArticleAssignButton;
