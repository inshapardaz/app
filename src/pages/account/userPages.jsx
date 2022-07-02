import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useParams, useLocation, Link, useHistory,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typogrpahy from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import CalendarViewMonthRoundedIcon from '@mui/icons-material/CalendarViewMonthRounded';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

// Local Imports
import { libraryService } from '@/services/';
import helpers from '@/helpers';

import Busy from '@/components/busy';
import Error from '@/components/error';
import PageList from '@/components/pages/pageList';
import PageGrid from '@/components/pages/pageGrid';
import PageFilterButton from '@/components/pages/pageFilterButton';
import PageSortButton from '@/components/pages/pageSortButton';
import PageSizeSelector from '@/components/pageSizeSelector';

// Local Import
import BookStatus from '@/models/bookStatus';
import PageStatus from '@/models/pageStatus';

const getSelectedPages = (pages, checked) => {
  if (pages && pages.data && checked.length > 0) {
    return pages.data.filter((p) => checked.includes(p.sequenceNumber));
  }

  return [];
};

// ---------------------------------------------------------------------

const SelectionButton = ({
  totalCount, selectedPages, onSelectAll, onSelectNone,
}) => {
  let icon = null;
  let selected = null;
  if (selectedPages.length === 0) {
    icon = <CheckBoxOutlineBlankIcon />;
    selected = 'none';
  } else if (selectedPages.length === totalCount) {
    icon = <CheckBoxIcon />;
    selected = 'all';
  } else {
    icon = <IndeterminateCheckBoxIcon />;
    selected = 'some';
  }

  const handleClick = () => {
    switch (selected) {
      case 'none':
        onSelectAll();
        break;
      default:
        onSelectNone();
    }
  };
  return (<Button onClick={handleClick}>{icon}</Button>);
};

SelectionButton.defaultProps = {
  totalCount: 0,
  selectedPages: null,
  onSelectAll: () => {},
  onSelectNone: () => {},
};

SelectionButton.propTypes = {
  totalCount: PropTypes.number,
  selectedPages: PropTypes.arrayOf(PropTypes.number),
  onSelectAll: PropTypes.func,
  onSelectNone: PropTypes.func,
};

// ---------------------------------------------------------------------

const UserPages = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [pages, setPages] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [checked, setChecked] = React.useState([]);
  const [showImages, setShowImages] = useState(localStorage.getItem('pagesImageView') === 'true');
  const library = useSelector((state) => state.libraryReducer.library);
  const [statusFilter, setStatusFilter] = useState(PageStatus.Typing);
  const [sortDirection, setSortDirection] = useState('ascending');
  const [assignmentFilter, setAssignmentFilter] = useState('assignedToMe');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const selectedPages = getSelectedPages(pages, checked);

  const loadData = () => {
    setError(false);
    const values = queryString.parse(location.search);
    libraryService.getMyPages(library.links.my_pages, values.filter, values.page, values.pageSize)
      .then((res) => {
        setPages(res);
        setStatusFilter(values.filter);
        setPage(values.page);
        setPageSize(values.pageSize || 12);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [library, location]);

  const toggleView = () => {
    localStorage.setItem('pagesImageView', !showImages);
    setShowImages(!showImages);
  };

  const handleCheckToggle = (sequenceNumber) => {
    const currentIndex = checked.indexOf(sequenceNumber);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(sequenceNumber);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const onStatusFilterUpdated = (newStatus, newAssignmentFilter) => {
    setStatusFilter(newStatus);
    setAssignmentFilter(newAssignmentFilter);
    history.push(
      helpers.buildLinkToBooksPagesPage(
        location,
        page,
        pageSize,
        newStatus,
        newAssignmentFilter,
      ),
    );
  };

  const onSortDirectionUpdated = (newSortDirection) => {
    setSortDirection(newSortDirection);
  };

  const onPageSizeChanged = (newPageSize) => {
    setPageSize(newPageSize);
    history.push(
      helpers.buildLinkToBooksPagesPage(
        location,
        page,
        newPageSize,
        statusFilter,
        assignmentFilter,
      ),
    );
  };

  const renderFilters = () => (
    <>
      <PageFilterButton
        book={book}
        statusFilter={statusFilter}
        assignmentFilter={assignmentFilter}
        onChange={onStatusFilterUpdated}
      />
      <PageSortButton
        sortDirection={sortDirection}
        onChange={onSortDirectionUpdated}
      />
    </>
  );

  const renderToolbar = () => (
    <Toolbar>
      <Typogrpahy variant="h4"><FormattedMessage id="my.pages.title" /></Typogrpahy>
      <div style={{ flexGrow: 1 }} />
      {renderFilters()}

      <ToggleButtonGroup
        value={showImages}
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
  );

  const renderPagination = () => {
    if (!busy && pages) {
      return (
        <Stack direction="row" spacing={2} justifyContent="center">
          <Pagination
            page={pages.currentPageIndex}
            count={pages.pageCount}
            showFirstButton
            showLastButton
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={helpers.buildLinkToBooksPagesPage(
                  location,
                  item.page,
                  pageSize,
                  statusFilter,
                  assignmentFilter,
                )}
                {...item}
              />
            )}
          />
          <PageSizeSelector
            pageSize={page && page.pageSize}
            onPageSizeSelected={onPageSizeChanged}
            title={<FormattedMessage id="page.pagination.size" values={{ pageSize }} />}
          />
        </Stack>
      );
    }

    return null;
  };

  const renderPages = () => {
    if (!pages) return null;

    if (showImages) {
      return (
        <PageGrid
          pages={pages}
          selectedPages={checked}
          onCheckChanged={handleCheckToggle}
          onUpdated={loadData}
        />
      );
    }

    return (
      <PageList
        pages={pages}
        selectedPages={checked}
        onCheckChanged={handleCheckToggle}
        onUpdated={loadData}
      />
    );
  };

  return (
    <div data-ft="book-pages">
      <Helmet title={intl.formatMessage({ id: 'pages.label' })} />
      <Error
        error={error}
        message={<FormattedMessage id="book.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        { renderToolbar() }
        { renderPages() }
        {renderPagination()}
      </Error>
    </div>
  );
};

export default UserPages;
