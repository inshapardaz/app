import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

// MUI
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

// Local imports
import { libraryService } from '@/services/';
import BookStatus from '@/models/bookStatus';
import BookListItem from '@/components/books/bookListItem';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Empty from '@/components/empty';

const BookStatusList = ({ bookStatus }) => {
  const intl = useIntl();
  const history = useHistory();
  const library = useSelector((state) => state.libraryReducer.library);
  const [books, setBooks] = React.useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getUserPublications(library.links.my_publishing, bookStatus)
      .then((res) => setBooks(res))
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };
  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [library, bookStatus]);

  let title = '';
  if (bookStatus === BookStatus.BeingTyped) {
    title = intl.formatMessage({ id: 'publishing.label.typing' });
  } else if (bookStatus === BookStatus.ProofRead) {
    title = intl.formatMessage({ id: 'publishing.label.proofReading' });
  } else {
    return null;
  }

  return (
    <>
      <Typography variant="h5">{title}</Typography>
      <Busy busy={busy}>
        <Error
          error={error}
          message={intl.formatMessage({ id: 'books.messages.error.loading' })}
          actionText={intl.formatMessage({ id: 'action.retry' })}
          onAction={loadData}
        >
          <Empty
            items={books ? books.data : null}
            message={intl.formatMessage({ id: 'books.messages.empty' })}
            actionText={intl.formatMessage({ id: 'publishing.label.seeMore' })}
            onAction={() => {
              history.push(`/books?status=${bookStatus}`);
            }}
          >
            <List component="nav" aria-label="books">
              {books && books.data.map((b) => (
                <BookListItem key={b.id} book={b} onUpdated={loadData} />
              ))}
            </List>
          </Empty>
        </Error>
      </Busy>
      <Divider sx={{ my: (theme) => theme.spacing(8) }} />
    </>
  );
};

BookStatusList.propTypes = {
  bookStatus: PropTypes.string.isRequired,
};

export default BookStatusList;
