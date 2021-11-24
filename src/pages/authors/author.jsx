import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import queryString from 'query-string';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import helpers from '@/helpers';
import BookList from '@/components/books/bookList';

// ---------------------------------------------------------------

const TabPanel = (props) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// ---------------------------------------------------------------

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// ---------------------------------------------------------------

const AuthorPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const { authorId } = useParams();
  const library = useSelector((state) => state.libraryReducer.library);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [author, setAuthor] = useState(null);
  const [value, setValue] = React.useState(0);

  const [books, setBooks] = useState(null);
  const [page, setPage] = useState(null);

  const loadBooks = (a) => {
    const values = queryString.parse(location.search);
    const pageValue = values.page ? parseInt(values.page, 10) : 1;

    libraryService.getBooksByAuthor(a.links.books, pageValue)
      .then((res) => setBooks(res))
      .then(() => {
        setPage(pageValue);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (authorId && library) {
      setBusy(true);
      if (author === null) {
        libraryService.getAuthorById(library.id, authorId)
          .then((res) => {
            setAuthor(res);
            return res;
          })
          .then((res) => loadBooks(res))
          .catch((e) => {
            console.error(e);
            setError(true);
          })
          .finally(() => setBusy(false));
      } else {
        loadBooks(author);
      }
    }
  }, [authorId, library, location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderAuthor = () => {
    if (author === null) {
      return null;
    }

    return (
      <>
        <Stack direction="row" spacing={2}>
          <Avatar
            src={author.links ? author.links.image : null}
            alt={author.name}
            onError={helpers.setDefaultAuthorImage}
            sx={{ height: 128, width: 128 }}
            variant="rounded"
          />
          <Stack direction="column" spacing={2}>
            <Typography variant="h3" gutterBottom>{author.name}</Typography>
            <Typography variant="subtitle1" gutterBottom><FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} /></Typography>
          </Stack>
        </Stack>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={intl.formatMessage({ id: 'author.tabs.description.title' })} {...a11yProps(0)} />
            <Tab label={intl.formatMessage({ id: 'author.tabs.books.title' })} {...a11yProps(1)} />
            <Tab label={intl.formatMessage({ id: 'author.tabs.articles.title' })} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Typography variant="body1" gutterBottom>
            {author.description}
          </Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BookList error={error} busy={busy} author={author.id} books={books} page={page} showFilters={false} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Empty empty message={<FormattedMessage id="authors.messages.articles" />} />
        </TabPanel>
      </>
    );
  };

  return (
    <>
      <Helmet title={author && author.name} />
      <Busy busy={busy} />
      <Container maxWidth="md" sx={{ my: (theme) => theme.spacing(2) }}>
        {renderAuthor()}
      </Container>
    </>
  );
};

export default AuthorPage;
