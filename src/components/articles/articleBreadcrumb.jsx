import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

// MUI
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import { libraryService } from '@/services/';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';
import PageStatusIcon from '@/components/pages/pageStatusIcon';

const ArticleBreadcrumb = ({ periodical, issue, selectedArticle }) => {
  const [articles, setArticles] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (issue && articles === null) {
      libraryService.getIssueArticles(issue.links.articles)
        .then((res) => setArticles(res));
    }
  }, [issue]);

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<BreadcrumbSeparator />}
      >
        <Link
          underline="hover"
          color="inherit"
          style={{ display: 'flex', alignItems: 'center' }}
          to={`/periodicals/${periodical.id}`}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {periodical && periodical.title}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          style={{ display: 'flex', alignItems: 'center' }}
          to={`/periodicals/${periodical.id}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {issue && moment(issue.issueDate).format('MMMM YYYY')}
        </Link>
        <Button
          id="chapters-button"
          aria-controls="chapters-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<PageStatusIcon status={selectedArticle && selectedArticle.status} />}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {selectedArticle && selectedArticle.title}
        </Button>
      </Breadcrumbs>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {articles && articles.data.map((c) => (
          <MenuItem
            key={c.id}
            selected={selectedArticle && selectedArticle.id === c.id}
            component={Link}
            to={`/periodicals/${periodical.id}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/articles/${c.sequenceNumber}/edit`}
            onClick={handleClose}
          >
            <LayersIcon />
            {c.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ArticleBreadcrumb.defaultProps = {
  periodical: { id: 0, title: '' },
  issue: { title: '' },
  selectedArticle: null,
};

ArticleBreadcrumb.propTypes = {
  periodical: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  issue: PropTypes.shape({
    id: PropTypes.number,
    volumeNumber: PropTypes.number,
    issueNumber: PropTypes.number,
    issueDate: PropTypes.string,
    links: PropTypes.shape({
      articles: PropTypes.string,
    }),
  }),
  selectedArticle: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default ArticleBreadcrumb;
