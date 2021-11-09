import React from 'react';

// MUI
import { DataGrid } from '@mui/x-data-grid';

const UserList = ({ users }) => {
  const columns = [
    {
      field: 'email', headerName: 'Email', width: 150, sortable: false, disableColumnMenu: true,
    },
    {
      field: 'name', headerName: 'Name', width: 150, sortable: false, disableColumnMenu: true,
    },
  ];

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={users.data} columns={columns} />
    </div>
  );
};

export default UserList;
