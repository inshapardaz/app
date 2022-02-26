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
import PeriodicalListItem from '@/components/periodicals/periodicalListItem';
import PeriodicalCard from '@/components/periodicals/periodicalCard';
import PeriodicalSortButton from '@/components/periodicals/periodicalSortButton';
import helpers from '@/helpers';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';
import SearchBox from '@/components/searchBox';

const PeriodicalsList = ({
  category, periodicals, page,
  query, sortBy,
  sortDirection,
  showFilters, error, busy, onUpdated,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [showCards, setShowCards] = useState(localStorage.getItem('periodicalsCardView') === 'true');

  const updateQuery = (newQuery) => {
    history.push(
      helpers.buildLinkToPeriodicalsPage(
        location,
        page,
        newQuery,
        category,
        sortBy,
        sortDirection,
      ),
    );
  };

  const renderPagination = () => {
    if (!busy && periodicals) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={periodicals.currentPageIndex}
          count={periodicals.pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={helpers.buildLinkToPeriodicalsPage(
                location,
                item.page,
                query,
                category,
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

  const onSortUpdated = (newSortBy, newSortDirection) => {
    history.push(
      helpers.buildLinkToPeriodicalsPage(
        location,
        page,
        query,
        category,
        newSortBy,
        newSortDirection,
      ),
    );
  };

  const toggleView = () => {
    localStorage.setItem('periodicalsCardView', !showCards);
    setShowCards(!showCards);
  };

  const renderList = () => (
    <List component="nav" aria-label="periodicals">
      {periodicals && periodicals.data.map((b) => (
        <PeriodicalListItem key={b.id} periodical={b} onUpdated={onUpdated} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {periodicals && periodicals.data.map((b) => (
        <Grid item key={b.id} xs={12} sm={6} md={4} alignItems="stretch">
          <PeriodicalCard periodical={b} key={b.id} onUpdated={onUpdated} />
        </Grid>
      ))}
    </Grid>
  );

  const renderFilters = () => {
    if (showFilters) {
      return (
        <>
          <SearchBox value={query} onChange={updateQuery} />
          {/* <BookFilterButton
            favorite={favoriteFilter}
            read={readFilter}
            statusFilter={statusFilter}
            showStatusFilter={periodicals != null && periodicals.links.create != null}
            onChange={onFilterUpdated}
          /> */}
          <PeriodicalSortButton
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
        message={<FormattedMessage id="periodicals.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={onUpdated}
      >
        <Busy busy={busy}>
          <Toolbar>
            {periodicals && periodicals.links.create && (
              <Button
                data-ft="create-periodical-button"
                variant="outlined"
                color="primary"
                component={Link}
                to="/periodicals/create"
                startIcon={<AddCircleOutlineIcon />}
              >
                <FormattedMessage id="periodicals.action.create" />
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
          <Empty items={periodicals && periodicals.data} message={<FormattedMessage id="periodicals.messages.empty" />}>
            {showCards ? renderCards() : renderList()}
          </Empty>
          {renderPagination()}
        </Busy>
      </Error>
    </>
  );
};

PeriodicalsList.defaultProps = {
  series: null,
  author: null,
  category: null,
  showFilters: true,
  periodicals: null,
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

PeriodicalsList.propTypes = {
  series: PropTypes.number,
  author: PropTypes.number,
  category: PropTypes.number,
  showFilters: PropTypes.bool,
  periodicals: PropTypes.shape({
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

export default PeriodicalsList;
