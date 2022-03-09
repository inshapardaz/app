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
import IssueListItem from '@/components/issues/issueListItem';
import IssueCard from '@/components/issues/issueCard';
import IssueSortButton from '@/components/issues/issueSortButton';
import helpers from '@/helpers';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';

const IssuesList = ({
  periodicalId,
  issues, page,
  sortDirection,
  showFilters, error, busy, onUpdated,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [showCards, setShowCards] = useState(localStorage.getItem('issuesCardView') === 'true');

  const renderPagination = () => {
    if (!busy && issues) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={issues.currentPageIndex}
          count={issues.pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={helpers.buildLinkToIssuesPage(
                location,
                item.page,
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

  const onSortUpdated = (newSortDirection) => {
    history.push(
      helpers.buildLinkToIssuesPage(
        location,
        page,
        newSortDirection,
      ),
    );
  };

  const toggleView = () => {
    localStorage.setItem('issuesCardView', !showCards);
    setShowCards(!showCards);
  };

  const renderList = () => (
    <List component="nav" aria-label="issues">
      {issues && issues.data.map((b) => (
        <IssueListItem key={b.id} issue={b} onUpdated={onUpdated} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {issues && issues.data.map((b) => (
        <Grid item key={b.id} xs={12} sm={6} md={4} alignItems="stretch">
          <IssueCard issue={b} key={b.id} onUpdated={onUpdated} />
        </Grid>
      ))}
    </Grid>
  );

  const renderFilters = () => {
    if (showFilters) {
      return (
        <>
          <IssueSortButton
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
        message={<FormattedMessage id="issues.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={onUpdated}
      >
        <Busy busy={busy}>
          <Toolbar>
            {issues && issues.links.create && (
              <Button
                data-ft="create-issues-button"
                variant="outlined"
                color="primary"
                component={Link}
                to={`/periodicals/${periodicalId}/issues/create`}
                startIcon={<AddCircleOutlineIcon />}
              >
                <FormattedMessage id="issues.action.create" />
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
          <Empty items={issues && issues.data} message={<FormattedMessage id="issues.messages.empty" />}>
            {showCards ? renderCards() : renderList()}
          </Empty>
          {renderPagination()}
        </Busy>
      </Error>
    </>
  );
};

IssuesList.defaultProps = {
  showFilters: true,
  issues: null,
  page: 1,
  sortDirection: 'ascending',
  error: false,
  busy: false,
  onUpdated: () => {},
};

IssuesList.propTypes = {
  showFilters: PropTypes.bool,
  periodicalId: PropTypes.string.isRequired,
  issues: PropTypes.shape({
    currentPageIndex: PropTypes.number,
    pageCount: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({

    })),
    links: PropTypes.shape({
      create: PropTypes.string,
    }),
  }),
  page: PropTypes.number,
  sortDirection: PropTypes.string,
  error: PropTypes.bool,
  busy: PropTypes.bool,
  onUpdated: PropTypes.func,
};

export default IssuesList;
