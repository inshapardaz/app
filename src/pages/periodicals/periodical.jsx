import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation, useParams, Link, useHistory,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl';
import queryString from 'query-string';

// MUI
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// Local Imports
import Typography from '@mui/material/Typography';
import { libraryService } from '@/services';
import helpers from '@/helpers';
import IssuesList from '@/components/issues/issuesList';
import PeriodicalDeleteButton from '@/components/periodicals/periodicalDeleteButton';

const IssuesPage = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
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

    setBusy(true);

    libraryService.getIssuesByPeriodicalsId(library.id, id,
      sortDirectionValue,
      pageValue)
      .then((res) => setIssues(res))
      .then(() => {
        setSortDirection(sortDirectionValue);
        setPage(pageValue);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  const loadPeriodical = () => {
    setBusy(true);
    libraryService.getPeriodicalById(library.id, id)
      .then((res) => setPeriodical(res))
      .then(() => {
        loadIssues();
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library) loadPeriodical();
  }, [library, location]);

  const renderEditLink = () => {
    if (periodical && periodical.links && periodical.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <Button
            component={Link}
            to={`/periodicals/${periodical.id}/edit`}
            startIcon={<EditOutlinedIcon />}
          >
            <FormattedMessage id="action.edit" />
          </Button>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div data-ft="issues-page">
      <Helmet title={intl.formatMessage({ id: 'header.issues' }, { title: periodical ? periodical.title : '' })} />
      <Grid container sx={{ mt: theme.spacing(2) }}>
        <Grid item md={2} sm={3}>
          <Stack
            spacing={2}
            mt={4}
            justifyContent="center"
            alignItems="center"
          >
            <img
              style={{ maxWidth: '235px' }}
              alt={periodical && periodical.title}
              src={(periodical && periodical.links ? periodical.links.image : null) || helpers.defaultIssueImage}
            />
            <Typography variant="h4">{periodical ? periodical.title : ''}</Typography>
            {renderEditLink()}
            { periodical && <PeriodicalDeleteButton periodical={periodical} button onDeleted={() => history.push('/periodicals')} />}
          </Stack>
        </Grid>
        <Grid item md={10}>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default IssuesPage;
