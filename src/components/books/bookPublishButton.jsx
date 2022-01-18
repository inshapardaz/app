import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';

// Local Imports
import { libraryService } from '@/services';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const BookPublishButton = ({ book, button = true }) => {
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onClick = () => {
    setBusy(true);

    libraryService.post(book.links.publish)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'book.messages.published' }), { variant: 'success' }))
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'book.messages.error.publishing' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  if (book && book.links && book.links.publish) {
    if (button) {
      return (
        <Button onClick={onClick} startIcon={<PublishIcon />}>
          <FormattedMessage id="book.action.publish" />
        </Button>
      );
    }
    return (
      <>
        <ButtonWithTooltip
          variant="outlined"
          tooltip={<FormattedMessage id="book.action.publish" />}
          disabled={busy}
          onClick={onClick}
        >
          <PublishIcon />
        </ButtonWithTooltip>
      </>
    );
  }
  return null;
};

BookPublishButton.defaultProps = {
  book: null,
  button: true,
};

BookPublishButton.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    links: PropTypes.shape({
      publish: PropTypes.string,
    }),
  }),
  button: PropTypes.bool,
};

export default BookPublishButton;
