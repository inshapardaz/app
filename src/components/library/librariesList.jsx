import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import List from '@mui/material/List';

// Local Import
import EmptyPlaceholder from '@/components/emptyPlaceHolder';
import Busy from '@/components/busy';
import DataPagination from '@/components/dataPagination';
import LibraryListItem from '@/components/library/libraryListItem';

const LibrariesList = ({
  libraries, query, loading, loadData,
}) => {
  if (!libraries || !libraries.data) {
    return (<EmptyPlaceholder title={<FormattedMessage id="libraries.message.empty" />} />);
  }
  return (
    <Busy busy={loading}>
      <List component="nav" aria-label="main categories">
        {libraries.data.map((l) => (
          <LibraryListItem key={l.id} library={l} onUpdated={loadData} />
        ))}
      </List>
      <DataPagination data={libraries} query={query} />
    </Busy>
  );
};

LibrariesList.defaultProps = {
  libraries: null,
  query: null,
  loading: false,
};

LibrariesList.propTypes = {
  libraries: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      language: PropTypes.string,
      supportsPeriodicals: PropTypes.bool,
      // eslint-disable-next-line react/forbid-prop-types
      links: PropTypes.any,
    })),
    currentPageIndex: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
  }),
  query: PropTypes.string,
  loading: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
};
export default LibrariesList;
