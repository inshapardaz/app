import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

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
import LayersIcon from '@mui/icons-material/Layers';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CreateIcon from '@mui/icons-material/Create';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Local Imports
import { libraryService } from '@/services/';
import AuthorsGroup from '@/components/authors/authorsGroup';
import CategoriesLabel from '@/components/categories/categoriesLabel';
import BookSeriesLabel from '@/components/books/bookSeriesLabel';
import DeleteBookButton from '@/components/books/deleteBookButton';
import FavoriteButton from '@/components/books/favoriteButton';
import ChaptersList from '@/components/chapters/chaptersList';
import BookFiles from '@/components/books/bookFiles';
import BookPublishingStatus from '@/components/books/bookPublishingStatus';
import BookPublishButton from '@/components/books/bookPublishButton';
import EditingStatusIcon from '@/components/editingStatusIcon';
import CopyrightIcon from '@/components/copyrightIcon';
import TabPanel from '@/components/tabPanel';
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
  const intl = useIntl();

  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [tabValue, setTabValue] = React.useState(0);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderBook = () => (
    <>
      <Helmet title={book.title} />
      <div>
        <Grid container sx={{ mt: (theme) => theme.spacing(2) }}>
          <Grid item md={3}>
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
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Typography variant="h4">
                  <EditingStatusIcon status={book.status} />
                  {book.title}
                </Typography>
                <FavoriteButton book={book} onUpdated={loadData} />
              </Stack>
              <Box sx={{ alignSelf: 'flex-start' }}>
                <AuthorsGroup authors={book.authors} />
              </Box>
              <CategoriesLabel categories={book.categories} alignPills="left" type="books" />
              <BookSeriesLabel book={book} />
              <Typography>{book.description}</Typography>
              <Typography sx={{ color: (theme) => (book.yearPublished ? theme.palette.text.primary : theme.palette.text.disabled) }}>
                <CopyrightIcon status={book.copyrights} />
                { book.yearPublished
                  ? <FormattedMessage id="book.editor.fields.yearPublished.display" values={{ year: book.yearPublished }} />
                  : <FormattedMessage id="book.editor.fields.yearPublished.empty" />}
              </Typography>
              <Divider sx={{ my: (theme) => theme.spacing(8) }} />
              {renderEditLink()}
              <DeleteBookButton button book={book} onDeleted={() => history.back()} />
              <BookPublishButton book={book} />
              { book.links.update && (
              <Button component={Link} to={`/books/${book.id}/pages`} startIcon={<FileCopyIcon />}>
                <FormattedMessage id="pages.label" />
                <Typography variant="caption">
                  { `(${book.pageCount})`}
                </Typography>
              </Button>
              )}
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Stack spacing={2} sx={{ mt: (theme) => theme.spacing(4) }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="book tabs">
                <Tab icon={<LayersIcon />} iconPosition="start" label={intl.formatMessage({ id: 'book.tabs.chapters' })} id="book-chapters" />
                <Tab icon={<SimCardDownloadIcon />} iconPosition="start" label={intl.formatMessage({ id: 'book.tabs.files' })} id="book-files" />
                { book.status !== 'Published' && (<Tab icon={<CreateIcon />} iconPosition="start" label={intl.formatMessage({ id: 'header.publishing' })} id="book-publishing" />)}
              </Tabs>
              <TabPanel id="book-chapters" value={tabValue} index={0}>
                <ChaptersList book={book} />
              </TabPanel>
              <TabPanel id="book-files" value={tabValue} index={1}>
                <BookFiles book={book} />
              </TabPanel>
              <TabPanel id="book-publishing" value={tabValue} index={2}>
                <BookPublishingStatus book={book} />
              </TabPanel>
            </Stack>
          </Grid>
        </Grid>
      </div>
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
