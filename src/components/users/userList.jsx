import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import BadgeIcon from '@mui/icons-material/Badge';

// Local Imports
import Empty from '@/components/empty';
import UserDeleteButton from '@/components/users/deleteUserButton';
import DataPagination from '@/components/dataPagination';

const RoleIcon = ({ role }) => {
  switch (role) {
    case 'libraryAdmin':
      return <SupervisedUserCircleIcon />;
    case 'writer':
      return <BadgeIcon />;
    case 'reader':
      return <AccountCircleIcon />;
    default:
      return <AccountCircleIcon />;
  }
};

RoleIcon.defaultProps = {
  role: 'None',
};

RoleIcon.propTypes = {
  role: PropTypes.string,
};

const UserList = ({
  libraryId, users, query, onUpdated,
}) => (
  <>
    <Empty items={users && users.data} message={<FormattedMessage id="users.messages.empty" />}>
      <List>
        {users && users.data.map((user) => (
          <ListItem
            key={user.id}
            disablePadding
            secondaryAction={(
              <>
                <UserDeleteButton user={user} onDeleted={onUpdated} />
              </>
)}
          >
            <ListItemButton component={Link} to={`/admin/libraries/${libraryId}/users/${user.id}/edit`}>
              <ListItemIcon>
                <RoleIcon role={user.role} />
              </ListItemIcon>
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Empty>
    <DataPagination data={users} query={query} />
  </>
);

UserList.defaultProps = {
  users: [],
  libraryId: null,
  query: null,
  onUpdated: () => {},
};
UserList.propTypes = {
  users: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    })),
  }),
  libraryId: PropTypes.number,
  query: PropTypes.string,
  onUpdated: PropTypes.func,
};

export default UserList;
