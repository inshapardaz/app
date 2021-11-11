import React from 'react';
import { FormattedMessage } from 'react-intl';

// MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Local Imports
import Empty from '@/components/empty';

const UserList = ({ users }) => (
  <Empty items={users && users.data} message={<FormattedMessage id="users.messages.empty" />}>
    <List>
      {users && users.data.map((user) => (
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Empty>
);

export default UserList;
