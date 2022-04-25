import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useLocation, useParams, useHistory, Link,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';

// MUI
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// Local Imports
import { libraryService } from '@/services';
import helpers from '@/helpers';
import IssueDeleteButton from '@/components/issues/issueDeleteButton';
import ArticleList from '@/components/articles/articlesList';
import Busy from '@/components/busy';
import Error from '@/components/error';

const IssueArticlesPage = () => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { periodicalId, volumeNumber, issueNumber } = useParams();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [periodical, setPeriodical] = useState(null);
  const [issue, setIssue] = useState(null);

  const loadPeriodical = () => {
    libraryService.getPeriodicalById(library.id, periodicalId)
      .then((res) => setPeriodical(res))
      .then(() => setBusy(false))
      .catch((e) => {
        if (e.status && e.status === 404) {
          history.push('/error/404');
        }
        setBusy(false);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  const loadIssue = () => {
    libraryService.getIssue(library.id, periodicalId, volumeNumber, issueNumber)
      .then((res) => setIssue(res))
      .then(() => setBusy(false))
      .catch((e) => {
        if (e.status && e.status === 404) {
          history.push('/error/404');
        }
        setBusy(false);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library) {
      loadPeriodical();
      loadIssue();
    }
  }, [library, location]);

  const renderEditLink = () => {
    if (issue && issue.links && issue.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <Button component={Link} to={`/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/edit`} startIcon={<EditOutlinedIcon />}>
            <FormattedMessage id="action.edit" />
          </Button>
        </Tooltip>
      );
    }
    return null;
  };

  const renderInformation = () => {
    if (issue === null) return null;
    const title = periodical ? moment(issue.issueDate).format('MMMM YYYY') : '';
    return (
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
      >
        <Typography variant="h4">{ title }</Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {issue.issueNumber && issue.issueNumber > 0 && <FormattedMessage id="issue.label.issueNumber" values={{ issueNumber: issue.issueNumber }} /> }
          {issue.volumeNumber && issue.volumeNumber > 0 && <span style={{ padding: '0 10px' }}>•</span>}
          {issue.volumeNumber && issue.volumeNumber > 0 && <FormattedMessage id="issue.label.volumeNumber" values={{ volumeNumber: issue.volumeNumber }} />}
        </Typography>
      </Stack>
    );
  };

  const header = periodical && issue ? intl.formatMessage({ id: 'header.articles' }, { title: periodical.title, issue: issue.issueNumber })
    : '';

  return (
    <div data-ft="articles-page">
      <Helmet title={header} />
      <Busy busy={busy} />
      <Error
        error={error}
        message={intl.formatMessage({ id: 'articles.message.empty' })}
        actionText={intl.formatMessage({ id: 'action.back' })}
        onAction={() => history.goBack()}
      >
        <Grid container sx={{ mt: theme.spacing(2) }}>
          <Grid item md={2}>
            <Stack
              spacing={2}
              mt={4}
              justifyContent="center"
              alignItems="center"
            >
              <img
                style={{ maxWidth: '288px' }}
                alt={issue && issue.title}
                src={(issue && issue.links ? issue.links.image : null) || helpers.defaultIssueImage}
              />
              {renderInformation()}
              {renderEditLink()}
              <IssueDeleteButton button issue={issue} onDeleted={() => history.back()} />
            </Stack>
          </Grid>
          <Grid item md={10}>
            <Stack spacing={2} sx={{ mt: theme.spacing(4) }}>
              <ArticleList issue={issue} />
            </Stack>
          </Grid>
        </Grid>
      </Error>
    </div>
  );
};

export default IssueArticlesPage;
