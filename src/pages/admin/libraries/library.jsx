import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// 3rd Party imports
import { Helmet } from 'react-helmet';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import PageHeader from '@/components/pageHeader';
import UserList from '@/components/users/userList';
import CenteredContent from '@/components/layout/centeredContent';

const LibraryPage = () => {
  const { libraryId } = useParams();
  const history = useHistory();
  const [busy, setBusy] = useState(true);
  const [library, setLibrary] = useState(null);
  const [users, setUsers] = useState(null);

  const handlerApiError = (e) => {
    setBusy(false);
    if (e.status) {
      history.push(`/error/${e.status}`);
    } else { history.goBack(); }
  };

  useEffect(() => {
    if (libraryId) {
      libraryService.getLibrary(libraryId)
        .then((lib) => {
          setLibrary(lib);
          return lib;
        })
        .then((lib) => {
          libraryService.getLibraryUsers(lib)
            .then((u) => setUsers(u))
            .then(() => setBusy(false))
            .catch((e) => handlerApiError(e));
        })
        .catch((e) => handlerApiError(e));
    } else {
      history.push('/error/404');
    }
  }, [libraryId]);

  const title = (library && library.name);

  return (
    <>
      <Helmet title={title} />
      <Busy busy={busy}>
        <PageHeader title={title} />
        <CenteredContent>

          <Button component={Link} to="/admin/libraries">Back to Libraries</Button>
          <Button component={Link} variant="primary" to={`/admin/libraries/${library ? library.id : 0}/users/add`}>Invite new User</Button>
          <Box>
            <UserList users={users} />
          </Box>
        </CenteredContent>

      </Busy>
    </>
  );
};

export default LibraryPage;