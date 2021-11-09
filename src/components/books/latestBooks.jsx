import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// MUI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';
import BookCard from '@/components/books/bookCard';

const LatestBooks = () => {
  const library = useSelector((state) => state.libraryReducer.library);
  const [books, setBooks] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setBusy(true);
    setError(false);
    libraryService.getLatestBooks(library)
      .then((b) => setBooks(b))
      .then(() => setBusy(false))
      .catch(() => setError(true));
  };
  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [library]);

  return (
    <Busy busy={busy}>
      <Container sx={{ py: (theme) => theme.spacing(8) }} maxWidth="md">
        <Grid container spacing={4}>
          <Error
            error={error}
            message={<FormattedMessage id="books.messages.error.loading" />}
            actionText={<FormattedMessage id="action.retry" />}
            onAction={loadData}
          >
            <Empty
              items={books ? books.data : []}
              message={<FormattedMessage id="books.messages.empty" />}
            >
              {books && books.data.map((b) => (
                <Grid item key={b.id} xs={12} sm={6} md={4}>
                  <BookCard book={b} key={b.id} />
                </Grid>
              )) }
            </Empty>
          </Error>
        </Grid>
      </Container>
    </Busy>
  );
};

export default LatestBooks;
