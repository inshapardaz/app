import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Local Import
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
  series, author, category, books, page,
  query, sortBy,
  sortDirection,
  favoriteFilter,
  readFilter,
  statusFilter, showFilters, error, busy, onUpdated,
}) => {
  const location = useLocation();
  const history = useHistory();
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
                favoriteFilter,
                readFilter,
                statusFilter,
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
        <BookListItem key={b.id} book={b} onUpdated={onUpdated} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {books && books.data.map((b) => (
        <Grid item key={b.id} xs={12} sm={6} md={4} alignItems="stretch">
          <BookCard book={b} key={b.id} onUpdated={onUpdated} />
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
        onAction={onUpdated}
      >
        <Busy busy={busy}>
          <Toolbar>
            {books && books.links.create && (
              <Button
                data-ft="create-book-button"
                variant="outlined"
                color="primary"
                component={Link}
                to="/books/create"
                startIcon={<AddCircleOutlineIcon />}
              >
                <FormattedMessage id="books.action.create" />
              </Button>
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
          </Empty>
          {renderPagination()}
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
  books: null,
  page: 1,
  query: null,
  sortBy: null,
  sortDirection: 'ascending',
  favoriteFilter: false,
  readFilter: false,
  statusFilter: 'published',
  error: false,
  busy: false,
  onUpdated: () => {},
};

BookList.propTypes = {
  series: PropTypes.number,
  author: PropTypes.number,
  category: PropTypes.number,
  showFilters: PropTypes.bool,
  books: PropTypes.shape({
    currentPageIndex: PropTypes.number,
    pageCount: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({

    })),
    links: PropTypes.shape({
      create: PropTypes.string,
    }),
  }),
  page: PropTypes.number,
  query: PropTypes.string,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  favoriteFilter: PropTypes.bool,
  readFilter: PropTypes.bool,
  statusFilter: PropTypes.string,
  error: PropTypes.bool,
  busy: PropTypes.bool,
  onUpdated: PropTypes.func,
};

export default BookList;
