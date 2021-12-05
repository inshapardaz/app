import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';

// Local Import
import DeleteLibraryButton from '@/components/library/deleteLibraryButton';
import EmptyPlaceholder from '@/components/emptyPlaceHolder';
import Busy from '@/components/busy';
import DataPagination from '@/components/dataPagination';

const LibrariesGrid = ({
  libraries, query, loading, loadData,
}) => {
  if (!libraries || !libraries.data) {
    return (<EmptyPlaceholder title={<FormattedMessage id="libraries.message.empty" />} />);
  }
  return (
    <Busy busy={loading}>
      <TableContainer data-ft="libraries-list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '30%' }}><FormattedMessage id="library.name.label" /></TableCell>
              <TableCell style={{ width: '30%' }}><FormattedMessage id="library.email.label" /></TableCell>
              <TableCell style={{ width: '30%' }}><FormattedMessage id="library.language.label" /></TableCell>
              <TableCell style={{ width: '30%' }}><FormattedMessage id="library.supportsPeriodical.label" /></TableCell>
              <TableCell style={{ width: '10%' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {libraries.data.map((library) => (
              <TableRow key={library.id} data-ft="libraries-list-row">
                <TableCell><Link data-ft="library-name" to={`/admin/libraries/${library.id}`}>{library.name}</Link></TableCell>
                <TableCell data-ft="library-owner-email">{library.ownerEmail}</TableCell>
                <TableCell data-ft="library-language">{library.language}</TableCell>
                <TableCell><Checkbox data-ft="library-supports-periodical" checked={library.supportsPeriodicals} disabled /></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap' }}>
                  {library.links && library.links.update && (
                  <IconButton data-ft="library-edit" component={Link} to={`/admin/libraries/${library.id}/edit`}>
                    <EditIcon />
                  </IconButton>
                  )}
                  <DeleteLibraryButton data-ft="library-delete" library={library} onDeleted={loadData} />
                </TableCell>
              </TableRow>
            ))}
            {loading && (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center" />
              </TableCell>
            </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <DataPagination data={libraries} query={query} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Busy>
  );
};

LibrariesGrid.defaultProps = {
  libraries: null,
  query: null,
  loading: false,
};

LibrariesGrid.propTypes = {
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
export default LibrariesGrid;
