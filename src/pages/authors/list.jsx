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
import AuthorListItem from '@/components/authors/authorListItem';
import AuthorCard from '@/components/authors/authorCard';
import SearchBox from '@/components/searchBox';

const AuthorsPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const library = useSelector((state) => state.libraryReducer.library);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [authors, setAuthors] = useState(null);
  const [showCards, setShowCards] = useState(localStorage.getItem('authorsCardView') === 'true');
  const [query, setQuery] = useState(null);

  const loadData = () => {
    if (library != null) {
      setBusy(true);
      setError(false);
      const values = queryString.parse(location.search);

      libraryService.getAuthors(library.links.authors, values.query, values.page)
        .then((res) => {
          setAuthors(res);
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
    if (!busy && authors) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={authors.currentPageIndex}
          count={authors.pageCount}
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
    localStorage.setItem('authorsCardView', !showCards);
    setShowCards(!showCards);
  };

  const renderList = () => (
    <List component="nav" aria-label="authors">
      {authors && authors.data.map((a) => (
        <AuthorListItem key={a.id} author={a} onDeleted={loadData} />
      ))}
    </List>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {authors && authors.data.map((a) => (
        <Grid item key={a.id} xs={12} sm={6} md={4}>
          <AuthorCard author={a} key={a.id} onDeleted={loadData} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div data-ft="authors-page">
      <Helmet title={intl.formatMessage({ id: 'header.authors' })} />
      <CenteredContent>
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ pr: 2 }}
          >
            <FormattedMessage id="header.authors" />
          </Typography>
          {authors && authors.links.create && (
            <Button
              data-ft="create-authors-button"
              variant="outlined"
              color="primary"
              component={Link}
              to="/authors/create"
              startIcon={<AddCircleOutlineIcon />}
            >
              <FormattedMessage id="authors.action.create" />
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
          message={<FormattedMessage id="authors.messages.error.loading" />}
          actionText={<FormattedMessage id="action.retry" />}
          onAction={loadData}
        >
          <Busy busy={busy}>
            <Empty items={authors && authors.data} message={<FormattedMessage id="authors.messages.empty" />}>
              {showCards ? renderCards() : renderList()}
              {renderPagination()}
            </Empty>
          </Busy>
        </Error>
      </CenteredContent>
    </div>
  );
};

export default AuthorsPage;
