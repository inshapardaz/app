import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';

// Local Imports
import { libraryService } from '@/services';
import helpers from '@/helpers';
import CenteredContent from '@/components/layout/centeredContent';
import CategoriesSideBar from '@/components/categories/categoriesSidebar';
import BookList from '@/components/books/bookList';

const BooksPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
  const isAboveSmall = useMediaQuery(theme.breakpoints.up('md'));
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState(null);
  const [category, setCategory] = useState(null);
  const [series, setSeries] = useState(null);
  const [author, setAuthor] = useState(null);
  const [query, setQuery] = useState(null);
  const [favoriteFilter, setFavoriteFilter] = useState(null);
  const [readFilter, setReadFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [page, setPage] = useState(null);

  const loadData = () => {
    const values = queryString.parse(location.search);
    const seriesValue = values.series ? parseInt(values.series, 10) : null;
    const authorValue = values.author ? parseInt(values.author, 10) : null;
    const categoryValue = values.category ? parseInt(values.category, 10) : null;
    const sortByValue = values.sortBy || null;
    const sortDirectionValue = values.sortDirection || null;
    const queryValue = values.query;
    const favoriteFilterValue = values.favorite === 'true';
    const readFilterValue = helpers.parseNullableBool(values.read);
    const statusFilterValue = values.status;
    const pageValue = values.page ? parseInt(values.page, 10) : 1;

    libraryService.getBooks(library.links.books,
      queryValue,
      authorValue,
      categoryValue,
      seriesValue,
      sortByValue,
      sortDirectionValue,
      favoriteFilterValue,
      readFilterValue,
      statusFilterValue,
      pageValue)
      .then((res) => setBooks(res))
      .then(() => {
        setAuthor(authorValue);
        setSeries(seriesValue);
        setCategory(categoryValue);
        setSortBy(sortByValue);
        setSortDirection(sortDirectionValue);
        setQuery(queryValue);
        setFavoriteFilter(favoriteFilterValue);
        setReadFilter(readFilterValue);
        setStatusFilter(statusFilterValue);
        setPage(pageValue);
      })
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };
  useEffect(() => {
    if (library) loadData();
  }, [library, location]);

  return (
    <div data-ft="books-page">
      <Helmet title={intl.formatMessage({ id: 'header.books' })} />
      <CenteredContent>
        <Grid container spacing={2} direction={isAboveSmall ? 'row' : 'column-reverse'}>
          <Grid item md={2}>
            <CategoriesSideBar selectedCategoryId={category} />
          </Grid>
          <Grid item md={10}>
            <BookList
              busy={busy}
              error={error}
              books={books}
              onUpdated={loadData}
              library={library}
              series={series}
              author={author}
              category={category}
              page={page}
              query={query}
              sortBy={sortBy}
              sortDirection={sortDirection}
              favoriteFilter={favoriteFilter}
              readFilter={readFilter}
              statusFilter={statusFilter}
            />
          </Grid>
        </Grid>
      </CenteredContent>
    </div>
  );
};

export default BooksPage;
