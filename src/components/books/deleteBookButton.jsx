import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

// Local Imports
import { libraryService } from '@/services';

const BookDeleteButton = ({ book, onDeleted, button = false }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = () => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'books.action.confirmDelete' }, { title: book.title }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => libraryService.deleteBook(book)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted(true))
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  };

  if (book && book.links && book.links.delete) {
    if (button) {
      return (
        <Button onClick={onDelete} startIcon={<DeleteIcon />} color="error">
          <FormattedMessage id="action.delete" />
        </Button>
      );
    }
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

BookDeleteButton.defaultProps = {
  onDeleted: () => {},
  button: false,
};

BookDeleteButton.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
  button: PropTypes.bool,
  onDeleted: PropTypes.func,
};

export default BookDeleteButton;
