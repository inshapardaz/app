import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// MUI
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// Local Imports
import { libraryService } from '@/services';
import LoadingPlaceHolder from '@/components/loadingPlaceHolder';
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
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };
  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [library]);

  return (
    <Container sx={{ py: (theme) => theme.spacing(8) }} maxWidth="md">
      <LoadingPlaceHolder busy={busy}>
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
      </LoadingPlaceHolder>
    </Container>
  );
};

export default LatestBooks;
