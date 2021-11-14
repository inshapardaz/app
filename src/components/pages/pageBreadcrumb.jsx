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

const PageBreadcrumb = ({
  book, chapter, page, showPage,
}) => {
  if (book == null) {
    return null;
  }

  const renderChapter = () => {
    if (book == null || chapter == null) return;
      <Link
        underline="hover"
        color="inherit"
        style={{ display: 'flex', alignItems: 'center' }}
        to={`/books/${book.id}/chapters/${chapter.id}`}
      >
        <LayersIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {chapter.title}
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
          to={`/books/${book.id}`}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {book.title}
        </Link>
        {renderChapter()}
        { showPage && (<Link
            underline="hover"
            color="inherit"
            style={{ display: 'flex', alignItems: 'center' }}
            to={`/books/${book.id}/pages`}
          >
            <FileCopyIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            <FormattedMessage id="pages.label" />
          </Link>) }
        { showPage && (<Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {page ? renderPageNumber() : renderPageCreate()}
          </Typography>)}
      </Breadcrumbs>
    </>
  );
};

PageBreadcrumb.defaultProps = {
  book: { id: 0, title: '' },
  chapter: null,
  page: null,
  showPage: false,
};

PageBreadcrumb.propTypes = {
  showPage: PropTypes.bool,
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
  page: PropTypes.shape({
    id: PropTypes.number,
    sequenceNumber: PropTypes.number,
  }),
};

export default PageBreadcrumb;
