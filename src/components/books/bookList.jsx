import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';

// MUI
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Local Import
import { libraryService } from '@/services';
import BookListItem from '@/components/books/bookListItem';
import BookCard from '@/components/books/bookCard';
import helpers from '@/helpers';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';
import BookFilterButton from '@/components/books/bookFilterButton';
import BookSortButton from '@/components/books/bookSortButton';
import SearchBox from '@/components/searchBox';

const BookList = ({
  library, series, author, category, showFilters,
}) => {
  const location = useLocation();
  const history = useHistory();

  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState(null);
  const [query, setQuery] = useState(null);
  const [favoriteFilter, setFavoriteFilter] = useState(null);
  const [readFilter, setReadFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [page, setPage] = useState(null);
  const [showCards, setShowCards] = useState(localStorage.getItem('booksCardView') === 'true');

  const updateQuery = (newQuery) => {
    history.push(
      helpers.buildLinkToBooksPage(
        location,
        page,
        newQuery,
        author,
        category,
        series,
        sortBy,
        sortDirection,
        favoriteFilter,
        readFilter,
        statusFilter,
      ),
    );
  };

  const onFilterUpdated = (newFavoriteFilter, newReadFilter, newStatusFilter) => {
    history.push(
      helpers.buildLinkToBooksPage(
        location,
        page,
        query,
        author,
        category,
        series,
        sortBy,
        sortDirection,
        newFavoriteFilter,
        newReadFilter,
        newStatusFilter,
      ),
    );
  };

  const onSortUpdated = (newSortBy, newSortDirection) => {
    history.push(
      helpers.buildLinkToBooksPage(
        location,
        page,
        query,
        author,
        category,
        series,
        newSortBy,
        newSortDirection,
        favoriteFilter,
        readFilter,
        statusFilter,
      ),
    );
  };

  const loadData = () => {
    if (library != null) {
      setBusy(true);
      setError(false);
      const values = queryString.parse(location.search);
      console.log(`List >> series :${series} author :${author} category :${category}`);
      libraryService.getBooks(library.links.books,
        query,
        author,
        category,
        series,
        values.sortBy,
        values.sortDirection,
        values.favorite,
        values.read,
        values.status,
        values.page)
        .then((res) => {
          setBooks(res);
          setQuery(values.query);
          setSortBy(values.sortBy);
          setFavoriteFilter(values.favorite === 'true');
          setReadFilter(helpers.parseNullableBool(values.read));
          setStatusFilter(values.status);
          setSortDirection(values.sortDirection);
          setPage(parseInt(values.page, 10));
        })
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [library, author, series, category, location]);

  const renderPagination = () => {
    if (!busy && books) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={books.currentPageIndex}
          count={books.pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={helpers.buildLinkToBooksPage(
                location,
                item.page,
                query,
                author,
                category,
                series,
                sortBy,
                sortDirection,
              )}
              {...item}
            />
          )}
        />
      );
    }

    return null;
  };

  const toggleView = () => {
    localStorage.setItem('booksCardView', !showCards);
    setShowCards(!showCards);
  };

  const renderList = () => (
    <List component="nav" aria-label="books">
      {books && books.data.map((b) => (
        <BookListItem key={b.id} book={b} onUpdated={loadData} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {books && books.data.map((b) => (
        <Grid item key={b.id} xs={12} sm={6} md={4} alignItems="stretch">
          <BookCard book={b} key={b.id} onUpdated={loadData} />
        </Grid>
      ))}
    </Grid>
  );

  const renderFilters = () => {
    if (showFilters) {
      return (
        <>
          <SearchBox value={query} onChange={updateQuery} />
          <BookFilterButton
            favorite={favoriteFilter}
            read={readFilter}
            statusFilter={statusFilter}
            showStatusFilter={books != null && books.links.create != null}
            onChange={onFilterUpdated}
          />
          <BookSortButton
            sortBy={sortBy}
            sortDirection={sortDirection}
            onChange={onSortUpdated}
          />
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Error
        error={error}
        message={<FormattedMessage id="books.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy}>
          <Toolbar>
            {books && books.links.create && (
            <Tooltip title={<FormattedMessage id="books.action.create" />}>
              <IconButton
                data-ft="create-book-button"
                variant="contained"
                color="primary"
                component={Link}
                to="/books/create"
              >
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            )}
            <div style={{ flexGrow: 1 }} />
            {renderFilters()}
            <ToggleButtonGroup
              value={showCards}
              exclusive
              size="small"
              onChange={toggleView}
              aria-label="view"
            >
              <ToggleButton value aria-label="show cards">
                <CalendarViewMonthRoundedIcon />
              </ToggleButton>
              <ToggleButton value={false} aria-label="show list">
                <ReorderRoundedIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
          <Empty items={books && books.data} message={<FormattedMessage id="books.messages.empty" />}>
            {showCards ? renderCards() : renderList()}
            {renderPagination()}
          </Empty>
        </Busy>
      </Error>
    </>
  );
};

BookList.defaultProps = {
  series: null,
  author: null,
  category: null,
  showFilters: true,
  library: null,
};

BookList.propTypes = {
  library: PropTypes.shape({
    links: PropTypes.shape({
      books: PropTypes.string,
    }),
  }),
  series: PropTypes.number,
  author: PropTypes.number,
  category: PropTypes.number,
  showFilters: PropTypes.bool,
};

export default BookList;
