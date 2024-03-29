import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardHideIcon from '@mui/icons-material/KeyboardHide';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DoneIcon from '@mui/icons-material/Done';

// Local Import
import { libraryService } from '@/services';
import PageStatus from '@/models/pageStatus';

const getStatusIcon = (status) => {
  switch (status) {
    case PageStatus.AvailableForTyping:
      return (<HourglassEmptyIcon />);
    case PageStatus.Typing:
      return (<KeyboardHideIcon />);
    case PageStatus.Typed:
      return (<SpellcheckIcon />);
    case PageStatus.InReview:
      return (<RateReviewIcon />);
    case PageStatus.Completed:
      return (<DoneIcon />);
    default:
      return null;
  }
};

const items = [];
// eslint-disable-next-line no-restricted-syntax
for (const [key, value] of Object.entries(PageStatus)) {
  if (key !== 'All') items.push({ key, value });
}

// ---------------------------------------------------------------

const ArticleStatusDialog = ({
  article, onUpdating, onUpdated, onClose, open,
}) => {
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (newStatus) => {
    setBusy(true);
    onUpdating();
    const c = { ...article };
    c.status = newStatus;
    c.contents = null;
    libraryService.updateArticle(article.links.update, c)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => setBusy(false))
      .then(() => onUpdated())
      .catch(() => {
        enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' });
        onClose();
      });
  };

  if (!article) return null;

  return (
    <>
      <Dialog
        maxWidth="sx"
        open={open}
        onClose={onClose}
      >
        <DialogTitle><FormattedMessage id="chapter.status.title" /></DialogTitle>
        <List sx={{ pt: 0 }} disabled={busy}>
          {items.map((item) => (
            <ListItemButton
              key={item.key}
              selected={item.value === article.status}
              onClick={() => handleChange(item.value)}
            >
              <ListItemAvatar>
                <ListItemIcon>
                  {getStatusIcon(item.value)}
                </ListItemIcon>
              </ListItemAvatar>
              <ListItemText primary={intl.formatMessage({ id: `status.${item.value}` })} />
            </ListItemButton>
          ))}
        </List>
      </Dialog>
    </>
  );
};

ArticleStatusDialog.defaultProps = {
  open: false,
  article: null,
  onUpdating: () => {},
  onUpdated: () => {},
  onClose: () => {},
};

ArticleStatusDialog.propTypes = {
  open: PropTypes.bool,
  article: PropTypes.shape({
    title: PropTypes.string,
    sequenceNumber: PropTypes.number,
    status: PropTypes.string,
    links: PropTypes.shape({
      update: PropTypes.string,
      assign: PropTypes.string,
    }),
  }),
  onUpdating: PropTypes.func,
  onUpdated: PropTypes.func,
  onClose: PropTypes.func,
};

export default ArticleStatusDialog;
