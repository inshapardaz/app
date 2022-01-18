import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// MUI
import { red } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';

// Local Imports
import { libraryService } from '@/services/';
import CenteredContent from '@/components/layout/centeredContent';
import AuthorsGroup from '@/components/authors/authorsGroup';
import BookCategoriesLabel from '@/components/books/bookCategoriesLabel';
import BookSeriesLabel from '@/components/books/bookSeriesLabel';
import DeleteBookButton from '@/components/books/deleteBookButton';
import FavoriteButton from '@/components/books/favoriteButton';
import ChaptersList from '@/components/chapters/chaptersList';
import BookPublishingStatus from '@/components/books/bookPublishingStatus';
import BookPublishButton from '@/components/books/bookPublishButton';
import Busy from '@/components/busy';
import Error from '@/components/error';
import helpers from '@/helpers';

const BookFavoriteIcon = ({ book }) => {
  if (book && book.links && book.links.remove_favorite) {
    return <FavoriteIcon sx={{ color: red[500] }} />;
  }

  return null;
};

BookFavoriteIcon.defaultProps = {
  book: {},
};

BookFavoriteIcon.propTypes = {
  book: PropTypes.shape({
    links: PropTypes.shape({
      remove_favorite: PropTypes.string,
    }),
  }),
};

// -------------------------------------------------------------

const BookPage = () => {
  const history = useHistory();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  const loadData = () => {
    setBusy(true);
    setError(false);
    libraryService.getBookById(library.id, bookId)
      .then((res) => setBook(res))
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  useEffect(() => {
    if (bookId && library) {
      loadData();
    }
  }, [bookId, library]);

  const renderEditLink = () => {
    if (book && book.links && book.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <Button component={Link} to={`/books/${book.id}/edit`} startIcon={<EditOutlinedIcon />}>
            <FormattedMessage id="action.edit" />
          </Button>
        </Tooltip>
      );
    }
    return null;
  };

  const renderBook = () => (
    <>
      <Helmet title={book.title} />
      <CenteredContent>
        <Grid container sx={{ mt: (theme) => theme.spacing(2) }}>
          <Grid item md={4}>
            <Stack
              spacing={2}
              mt={4}
              justifyContent="center"
              alignItems="center"
            >
              <img
                style={{ maxWidth: '288px' }}
                alt={book.title}
                src={(book.links ? book.links.image : null) || helpers.defaultBookImage}
              />
              {renderEditLink()}
              <DeleteBookButton button book={book} onDeleted={() => history.back()} />
              <BookPublishButton book={book} />
              <Button component={Link} to={`/books/${book.id}/pages`} startIcon={<FileCopyIcon />}>
                <FormattedMessage id="pages.label" />
                <Typography variant="caption">
                  { `(${book.pageCount})`}
                </Typography>
              </Button>
              <BookPublishingStatus book={book} />
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Stack spacing={2} sx={{ mt: (theme) => theme.spacing(4) }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Typography variant="h4">{book.title}</Typography>
                <FavoriteButton book={book} onUpdated={loadData} />
              </Stack>
              <Box sx={{ alignSelf: 'flex-start' }}>
                <AuthorsGroup authors={book.authors} />
              </Box>
              <BookCategoriesLabel book={book} alignPills="left" />
              <BookSeriesLabel book={book} />
              <Typography>{book.description}</Typography>
              <Divider sx={{ my: (theme) => theme.spacing(8) }} />
              <ChaptersList book={book} />
            </Stack>
          </Grid>
        </Grid>
      </CenteredContent>
    </>
  );

  return (
    <div data-ft="edit-book-page">
      <Error
        error={error}
        message={<FormattedMessage id="book.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        { book && renderBook()}
      </Error>
    </div>
  );
};

export default BookPage;
