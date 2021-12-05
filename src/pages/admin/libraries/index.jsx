import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';

// MUI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Local Imports
import { libraryService } from '@/services';
import LibrariesList from '@/components/library/librariesList';
import CenteredContent from '@/components/layout/centeredContent';
import SearchBox from '@/components/searchBox';
import helpers from '@/helpers';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

const LibrariesPage = () => {
  const location = useLocation();
  const intl = useIntl();
  const history = useHistory();
  const [query, setQuery] = useState(null);
  const [libraries, setLibraries] = useState();
  const [busy, setBusy] = useState(true);

  const updateQuery = (newQuery) => {
    const values = queryString.parse(location.search);
    const { page } = values;
    history.push(
      helpers.buildLinkToLibrariesPage(
        location,
        page,
        newQuery,
      ),
    );
  };

  const loadData = () => {
    const values = queryString.parse(location.search);
    const { page } = values;
    const { q } = values;
    setQuery(q);
    libraryService.getLibraries(q, page)
      .then((lib) => setLibraries(lib))
      .then(() => setBusy(false))
      .catch((e) => {
        setBusy(false);
        if (e.status) {
          history.push(`/error/${e.status}`);
        } else { history.goBack(); }
      });
  };

  useEffect(() => {
    loadData();
  }, [location]);

  return (
    <div data-ft="admin-libraries-page">
      <Helmet title={intl.formatMessage({ id: 'libraries.header' })} />
      <CenteredContent>
        <Breadcrumbs aria-label="breadcrumb" separator={<BreadcrumbSeparator />}>
          <Typography color="text.primary"><FormattedMessage id="header.administration" /></Typography>
          <Typography color="text.primary"><FormattedMessage id="admin.libraries.title" /></Typography>
        </Breadcrumbs>
        <Toolbar>
          {libraries && libraries.links.create && (
          <Tooltip title={<FormattedMessage id="admin.library.add" />}>
            <IconButton
              data-ft="create-library-button"
              variant="contained"
              color="primary"
              component={Link}
              to="/admin/libraries/create"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          )}
          <SearchBox value={query} onChange={updateQuery} />
        </Toolbar>
        <LibrariesList libraries={libraries} query={query} loading={busy} loadData={loadData} />
      </CenteredContent>
    </div>
  );
};

export default LibrariesPage;
