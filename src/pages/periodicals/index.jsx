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
import CenteredContent from '@/components/layout/centeredContent';
import CategoriesSideBar from '@/components/categories/categoriesSidebar';
import PeriodicalsList from '@/components/periodicals/periodicalsList';

const PeriodicalsPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
  const isAboveSmall = useMediaQuery(theme.breakpoints.up('md'));
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [periodicals, setPeriodicals] = useState(null);
  const [category, setCategory] = useState(null);
  const [query, setQuery] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [page, setPage] = useState(null);

  const loadData = () => {
    const values = queryString.parse(location.search);
    const categoryValue = values.category ? parseInt(values.category, 10) : null;
    const sortByValue = values.sortBy || null;
    const sortDirectionValue = values.sortDirection || null;
    const queryValue = values.query;
    const pageValue = values.page ? parseInt(values.page, 10) : 1;

    libraryService.getPeriodicals(library.links.periodicals,
      queryValue,
      categoryValue,
      sortByValue,
      sortDirectionValue,
      pageValue)
      .then((res) => setPeriodicals(res))
      .then(() => {
        setCategory(categoryValue);
        setSortBy(sortByValue);
        setSortDirection(sortDirectionValue);
        setQuery(queryValue);
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
    <div data-ft="periodicals-page">
      <Helmet title={intl.formatMessage({ id: 'header.periodicals' })} />
      <CenteredContent>
        <Grid container spacing={2} direction={isAboveSmall ? 'row' : 'column-reverse'}>
          <Grid item md={2}>
            <CategoriesSideBar selectedCategoryId={category} />
          </Grid>
          <Grid item md={10}>
            <PeriodicalsList
              busy={busy}
              error={error}
              periodicals={periodicals}
              onUpdated={loadData}
              library={library}
              category={category}
              page={page}
              query={query}
              sortBy={sortBy}
              sortDirection={sortDirection}
            />
          </Grid>
        </Grid>
      </CenteredContent>
    </div>
  );
};

export default PeriodicalsPage;
