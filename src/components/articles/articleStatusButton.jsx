import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

// Local Imports
import ArticleStatusDialog from '@/components/articles/articleStatusDialog';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const ArticleStatusButton = ({
  article, onUpdating, onUpdated, onClose, button,
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
        disabled={article === null}
        onClick={handleClick}
        variant="outlined"
        size="large"
        tooltip={<FormattedMessage id="pages.setStatus" />}
        endIcon={<InfoOutlinedIcon fontSize="small" />}
      >
        <ArticleStatusDialog article={article} onUpdating={onUpdating} onUpdated={handleUpdate} onClose={handleClose} open={open} />
      </ButtonWithTooltip>
    );
  }

  return (
    <MenuItem
      disabled={article === null}
      onClick={handleClick}
    >
      <ListItemIcon>
        <InfoOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>
        <FormattedMessage id="pages.setStatus" />
      </ListItemText>
      <ArticleStatusDialog article={article} onUpdating={onUpdating} onUpdated={handleUpdate} onClose={handleClose} open={open} />
    </MenuItem>
  );
};

ArticleStatusButton.defaultProps = {
  article: null,
  button: false,
  onUpdating: () => {},
  onUpdated: () => {},
  onClose: () => {},
};

ArticleStatusButton.propTypes = {
  article: PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      assign: PropTypes.string,
    }),
  }),
  button: PropTypes.bool,
  onUpdating: PropTypes.func,
  onUpdated: PropTypes.func,
  onClose: PropTypes.func,
};

export default ArticleStatusButton;
