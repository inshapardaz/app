import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Local Imports
import { libraryService } from '@/services';
import IssuesList from '@/components/issues/issuesList';
import PageHeader from '@/components/pageHeader';

const IssuesPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
  const isAboveSmall = useMediaQuery(theme.breakpoints.up('md'));
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [periodical, setPeriodical] = useState(null);
  const [issues, setIssues] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [page, setPage] = useState(null);

  const loadIssues = () => {
    const values = queryString.parse(location.search);
    const sortDirectionValue = values.sortDirection || null;
    const pageValue = values.page ? parseInt(values.page, 10) : 1;

    libraryService.getIssuesByPeriodicalsId(library.id, id,
      sortDirectionValue,
      pageValue)
      .then((res) => setIssues(res))
      .then(() => {
        setSortDirection(sortDirectionValue);
        setPage(pageValue);
      })
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  const loadPeriodical = () => {
    libraryService.getPeriodicalById(library.id, id)
      .then((res) => setPeriodical(res))
      .then(() => {
        loadIssues();
      })
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  useEffect(() => {
    if (library) loadPeriodical();
  }, [library, location]);

  return (
    <div data-ft="issues-page">
      <Helmet title={intl.formatMessage({ id: 'header.issues' }, { title: periodical ? periodical.title : '' })} />
      <PageHeader title={periodical ? periodical.title : ''} />
      <IssuesList
        busy={busy}
        error={error}
        issues={issues}
        onUpdated={loadIssues}
        library={library}
        page={page}
        sortDirection={sortDirection}
        periodicalId={id}
      />
    </div>
  );
};

export default IssuesPage;
