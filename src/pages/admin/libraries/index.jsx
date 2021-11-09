import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

// Local Imports
import { libraryService } from '@/services';
import LibrariesGrid from '@/components/library/librariesGrid';
import PageHeader from '@/components/pageHeader';

const LibrariesPage = () => {
  const location = useLocation();
  const intl = useIntl();
  const history = useHistory();
  const [query, setQuery] = useState(null);
  const [libraries, setLibraries] = useState();
  const [busy, setBusy] = useState(true);

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
      <PageHeader title={<FormattedMessage id="libraries.header" />} />
      <Box sx={{ mt: 2 }}>
        <Toolbar>
          <Button data-ft="create-library-button" variant="contained" color="primary" component={Link} to="/admin/libraries/create"><FormattedMessage id="admin.library.add" /></Button>
        </Toolbar>
        <LibrariesGrid libraries={libraries} query={query} loading={busy} loadData={loadData} />
      </Box>
    </div>
  );
};

export default LibrariesPage;
