import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Local Imports
import DeleteLibraryButton from '@/components/library/deleteLibraryButton';

const LibraryListItem = ({ library, onUpdated }) => {
  const history = useHistory();

  const onLibraryClicked = () => {
    history.push(`/admin/libraries/${library.id}`);
  };

  return (
    <ListItem
      key={library.id}
      button
      divider
      secondaryAction={(
        <>
          {library.links && library.links.update && (
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton data-ft="library-edit" component={Link} to={`/admin/libraries/${library.id}/edit`}><EditIcon /></IconButton>
          </Tooltip>
          )}
          <DeleteLibraryButton data-ft="library-delete" library={library} onDeleted={onUpdated} />
        </>
)}
    >
      <ListItemIcon onClick={onLibraryClicked}>
        <LocalLibraryIcon />
      </ListItemIcon>
      <ListItemText
        onClick={onLibraryClicked}
        primary={library.name}
        secondary={library.ownerEmail}
      />
      {/* Show language and if periodicals enabled */}
    </ListItem>
  );
};

LibraryListItem.defaultProps = {
  onUpdated: () => {},
};

LibraryListItem.propTypes = {
  library: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    ownerEmail: PropTypes.string,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
  onUpdated: PropTypes.func,
};

export default LibraryListItem;
