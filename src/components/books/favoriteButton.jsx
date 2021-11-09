import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import { red } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Local imports
import { libraryService } from '@/services';

const FavoriteButton = ({ book, onUpdated }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(true);

  const changeFavorite = () => {
    if (book && book.links && book.links.create_favorite) {
      setBusy(true);
      libraryService.post(book.links.create_favorite, {})
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.favorite.added' }), { variant: 'success' }))
        .then(() => onUpdated())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.favorite.adding' }), { variant: 'error' }))
        .finally(() => setBusy(false));
    } else if (book && book.links && book.links.remove_favorite) {
      setBusy(true);
      libraryService.delete(book.links.remove_favorite, {})
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.favorite.removed' }), { variant: 'success' }))
        .then(() => onUpdated())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.favorite.removing' }), { variant: 'error' }))
        .finally(() => setBusy(false));
    }
  };

  if (book && book.links && book.links.create_favorite) {
    return (
      <Tooltip title={<FormattedMessage id="books.action.favorite.add" />}>
        <IconButton aria-label="add to favorites" loading={busy.toString()} onClick={() => changeFavorite()}>
          <FavoriteBorderIcon />
        </IconButton>
      </Tooltip>
    );
  }
  if (book && book.links && book.links.remove_favorite) {
    return (
      <Tooltip title={<FormattedMessage id="books.action.favorite.remove" />}>
        <IconButton aria-label="remove from favorites" loading={busy.toString()} onClick={() => changeFavorite()}>
          <FavoriteIcon sx={{ color: red[500] }} />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

FavoriteButton.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    links: PropTypes.shape({
      create_favorite: PropTypes.string,
      remove_favorite: PropTypes.string,
    }),
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

export default FavoriteButton;
