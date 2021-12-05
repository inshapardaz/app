import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

// MUI
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const DataPagination = ({
  data, query,
}) => {
  const location = useLocation();

  const buildLinkToPage = (l, p, q) => {
    let querystring = '';
    querystring += p ? `page=${p}` : '';
    querystring += query ? `&q=${q}` : '';
    if (querystring !== '') {
      querystring = `?${querystring}`;
    }
    return `${l.pathname}${querystring}`;
  };

  if (data) {
    return (
      <Pagination
        page={data.currentPageIndex}
        count={data.pageCount}
        variant="outlined"
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={buildLinkToPage(location, item.page, query)}
            {...item}
          />
        )}
      />
    );
  }

  return null;
};

DataPagination.defaultProps = {
  data: null,
  query: null,
  loading: false,
  location: null,
};

DataPagination.propTypes = {
  data: PropTypes.shape({
    currentPageIndex: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }),
  query: PropTypes.string,
  loading: PropTypes.bool,
  location: PropTypes.string,
};

export default DataPagination;
