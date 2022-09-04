import React, { useEffect, useState } from 'react';
import {
  Link, useParams, useLocation, useHistory,
} from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// 3rd Party imports
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import UserList from '@/components/users/userList';
import CenteredContent from '@/components/layout/centeredContent';
import SearchBox from '@/components/searchBox';
import helpers from '@/helpers';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

const LibraryPage = () => {
  const location = useLocation();
  const { libraryId } = useParams();
  const history = useHistory();
  const [busy, setBusy] = useState(true);
  const [library, setLibrary] = useState(null);
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState(null);

  const updateQuery = (newQuery) => {
    const values = queryString.parse(location.search);
    const { page } = values;
    history.push(
      helpers.buildLinkToLibraryUsersPage(
        location,
        page,
        newQuery,
      ),
    );
  };

  const handlerApiError = (e) => {
    console.error(e);
    setBusy(false);
    if (e.status) {
      history.push(`/error/${e.status}`);
    } else { history.goBack(); }
  };

  const loadUsers = (lib) => {
    setBusy(true);
    const values = queryString.parse(location.search);
    const { page } = values;
    const { q } = values;
    setQuery(q);
    return libraryService.getLibraryUsers(lib, q, page)
      .then((u) => setUsers(u))
      .then(() => setBusy(false))
      .catch((e) => handlerApiError(e));
  };

  const loadData = () => {
    setBusy(true);
    libraryService.getLibrary(libraryId)
      .then((lib) => {
        if (!lib || !lib.links || !lib.links.update) {
          history.push('/error/403');
        }

        setLibrary(lib);
        return lib;
      })
      .then((lib) => loadUsers(lib))
      .catch((e) => handlerApiError(e))
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library) {
      loadUsers(library);
    }
  }, [location]);

  useEffect(() => {
    if (libraryId) {
      loadData();
    } else {
      history.push('/error/404');
    }
  }, [libraryId]);

  const title = (library && library.name);

  return (
    <>
      <Helmet title={title} />
      <Busy busy={busy}>
        <CenteredContent>
          <Breadcrumbs aria-label="breadcrumb" separator={<BreadcrumbSeparator />}>
            <Typography color="text.primary"><FormattedMessage id="header.administration" /></Typography>
            <Link underline="hover" color="inherit" to="/admin/libraries">
              <FormattedMessage id="admin.libraries.title" />
            </Link>
            <Typography color="text.primary">{library && library.name}</Typography>
            <Typography color="text.primary"><FormattedMessage id="admin.users.title" /></Typography>
          </Breadcrumbs>
          <Toolbar>
            {library && library.links.update && (
            <Button
              data-ft="edit-library-button"
              variant="outlined"
              color="primary"
              component={Link}
              to={`/admin/libraries/${library ? library.id : 0}/edit`}
              startIcon={<EditOutlinedIcon />}
            >
              <FormattedMessage id="library.editor.header.edit" values={{ name: library.name }} />
            </Button>
            )}
            {library && library.links.add_user && (
              <Button
                data-ft="add-library-user-button"
                variant="outlined"
                color="primary"
                component={Link}
                to={`/admin/libraries/${library ? library.id : 0}/users/add`}
                startIcon={<AddCircleOutlineIcon />}
              >
                <FormattedMessage id="invite.action" />
              </Button>
            )}
            <SearchBox value={query} onChange={updateQuery} />
          </Toolbar>
          <UserList libraryId={library ? library.id : null} query={query} users={users} onUpdated={loadData} />
        </CenteredContent>

      </Busy>
    </>
  );
};

export default LibraryPage;
