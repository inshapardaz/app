import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LayersIcon from '@mui/icons-material/Layers';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateIcon from '@mui/icons-material/Create';

// Local Imports
import { localeService } from '@/services/';

const IssuePageBreadcrumb = ({
  issue, article, page, showPage,
}) => {
  if (issue == null) {
    return null;
  }

  const renderIssue = () => {
    if (issue == null || article == null) return;
      <Link
        underline="hover"
        color="inherit"
        style={{ display: 'flex', alignItems: 'center' }}
        to={`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${article.sequenceNumber}`}
      >
        <LayersIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {article.title}
      </Link>;
  };

  const renderPageNumber = () => (
    <>
      <CreateIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      <FormattedMessage id="page.editor.header" values={{ sequenceNumber: page.sequenceNumber }} />
    </>
  );

  const renderPageCreate = () => (
    <>
      <AddCircleOutlineIcon sx={{ mr: 0.5 }} fontSize="inherit" />
      <FormattedMessage id="page.editor.header.add" />
    </>
  );

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={localeService.isRtl() ? <NavigateBeforeIcon fontSize="small" /> : <NavigateNextIcon fontSize="small" />}
        sx={{ mr: (theme) => theme.spacing(1) }}
      >
        <Link
          underline="hover"
          color="inherit"
          style={{ display: 'flex', alignItems: 'center' }}
          to={`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          <FormattedMessage id="issue.label" />
        </Link>
        {renderIssue()}
        { showPage && (
        <Link
          underline="hover"
          color="inherit"
          style={{ display: 'flex', alignItems: 'center' }}
          to={`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/`}
        >
          <FileCopyIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          <FormattedMessage id="pages.label" />
        </Link>
        ) }
        { showPage && (
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          {page ? renderPageNumber() : renderPageCreate()}
        </Typography>
        )}
      </Breadcrumbs>
    </>
  );
};

IssuePageBreadcrumb.defaultProps = {
  issue: { id: 0, title: '' },
  article: null,
  page: null,
  showPage: false,
};

IssuePageBreadcrumb.propTypes = {
  showPage: PropTypes.bool,
  issue: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    periodicalId: PropTypes.number,
    volumeNumber: PropTypes.number,
    issueNumber: PropTypes.number,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    sequenceNumber: PropTypes.number,
  }),
  page: PropTypes.shape({
    id: PropTypes.number,
    sequenceNumber: PropTypes.number,
  }),
};

export default IssuePageBreadcrumb;
