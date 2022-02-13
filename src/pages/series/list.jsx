import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';
import CenteredContent from '@/components/layout/centeredContent';
import SeriesListItem from '@/components/series/seriesListItem';
import SeriesCard from '@/components/series/seriesCard';
import SearchBox from '@/components/searchBox';

const SeriesPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const library = useSelector((state) => state.libraryReducer.library);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [series, setSeries] = useState(null);
  const [showCards, setShowCards] = useState(localStorage.getItem('seriesCardView') === 'true');
  const [query, setQuery] = useState(null);

  const loadData = () => {
    if (library != null) {
      setBusy(true);
      setError(false);
      const values = queryString.parse(location.search);

      libraryService.getSeries(library.links.series, values.query, values.page)
        .then((res) => {
          setSeries(res);
          setQuery(values.query);
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
  }, [library, location]);

  const buildLinkToPage = (page, q) => {
    let querystring = '';
    querystring += page ? `page=${page}&` : '';
    querystring += q ? `query=${q}` : '';
    if (querystring !== '') {
      querystring = `?${querystring.trim('&')}`;
    }
    return `${location.pathname}${querystring}`;
  };

  const updateQuery = (newQuery) => {
    const values = queryString.parse(location.search);
    history.push(buildLinkToPage(values.page, newQuery));
  };

  const renderPagination = () => {
    if (!busy && series) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={series.currentPageIndex}
          count={series.pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={buildLinkToPage(item.page, query)}
              {...item}
            />
          )}
        />
      );
    }

    return null;
  };

  const toggleView = () => {
    localStorage.setItem('seriesCardView', !showCards);
    setShowCards(!showCards);
  };

  const renderList = () => (
    <List component="nav" aria-label="series">
      {series && series.data.map((s) => (
        <SeriesListItem key={s.id} series={s} onDeleted={loadData} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={4}>
      {series && series.data.map((s) => (
        <Grid item key={s.id} xs={12} sm={6} md={4}>
          <SeriesCard series={s} key={s.id} onDeleted={loadData} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div data-ft="series-page">
      <Helmet title={intl.formatMessage({ id: 'header.series' })} />
      <CenteredContent>
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ pr: 2 }}
          >
            <FormattedMessage id="header.series" />
          </Typography>
          {series && series.links.create && (
            <Button
              data-ft="create-series-button"
              variant="outlined"
              color="primary"
              component={Link}
              to="/series/create"
              StartIcon={<AddCircleOutlineIcon />}
            >
              <FormattedMessage id="series.action.create" />
            </Button>
          )}
          <div style={{ flexGrow: 1 }} />
          <SearchBox value={query} onChange={updateQuery} />
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

        <Error
          error={error}
          message={<FormattedMessage id="series.messages.error.loading" />}
          actionText={<FormattedMessage id="action.retry" />}
          onAction={loadData}
        >
          <Busy busy={busy}>
            <Empty items={series && series.data} message={<FormattedMessage id="series.messages.empty" />}>
              {showCards ? renderCards() : renderList()}
              {renderPagination()}
            </Empty>
          </Busy>
        </Error>
      </CenteredContent>
    </div>
  );
};

export default SeriesPage;
