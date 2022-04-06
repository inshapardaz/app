import React, { useEffect, useState } from 'react';
import {
  Link, useLocation, useHistory, useParams,
} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

// Local Imports
import LanguageDropDownButton from '@/components/language/languageDropDownButton';
import ProfileDropDown from '@/components/corrections/profileDropDown';
import CorrectionListItem from '@/components/corrections/correctionListItem';
import SearchBox from '@/components/searchBox';
import Busy from '@/components/busy';
import Empty from '@/components/empty';
import Error from '@/components/error';
import CenteredContent from '@/components/layout/centeredContent';
import { toolsService, localeService } from '@/services';

const CorrectionsListPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const {
    language = localeService.getCurrentLanguage(), profile = 'autocorrect', page, pageSize = 10,
  } = useParams();
  const [corrections, setCorrections] = useState();
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadCorrections = () => {
    setBusy(true);
    setError(false);
    const values = queryString.parse(location.search);

    toolsService.getCorrections(language, profile, values.query, values.page)
      .then((res) => {
        setCorrections(res);
        setQuery(values.query);
        setBusy(false);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    loadCorrections(language, profile, page, pageSize);
  }, [language, profile, location]);

  const buildLinkToPage = (p, q) => {
    let querystring = '';
    querystring += p ? `page=${p}&` : '';
    querystring += q ? `query=${q}` : '';
    if (querystring !== '') {
      querystring = `?${querystring.trim('&')}`;
    }
    return `${location.pathname}${querystring}`;
  };

  const updateQuery = (newQuery) => {
    const values = queryString.parse(location.search);
    history.push(buildLinkToPage(values.page, newQuery));
  };

  const updateParams = (l, p) => {
    history.push(`/tools/corrections/${l}/${p}`);
  };

  const renderPagination = () => {
    if (!busy && corrections) {
      return (
        <Pagination
          sx={{ my: (theme) => theme.spacing(2) }}
          page={corrections.currentPageIndex}
          count={corrections.pageCount}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={buildLinkToPage(item.page, query)}
              {...item}
            />
          )}
        />
      );
    }

    return null;
  };

  return (
    <div data-ft="categories-page">
      <Helmet title={intl.formatMessage({ id: 'correction.profile.label' })} />
      <CenteredContent>
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ pr: 2 }}
          >
            <FormattedMessage id="correction.profile.label" />
          </Typography>
          <LanguageDropDownButton selectedLanguage={language} onChange={(l) => { updateParams(l, profile); }} />
          <ProfileDropDown selectedProfile={profile} onChange={(p) => { updateParams(language, p); }} />
          {corrections && corrections.links.create && (
          <Button
            data-ft="create-category-button"
            variant="outlined"
            color="primary"
            component={Link}
            to={`/tools/corrections/${language}/${profile}/add`}
            startIcon={<AddCircleOutlineIcon />}
          >
            <FormattedMessage id="correction.action.create" />
          </Button>
          )}

          <SearchBox value={query} onChange={updateQuery} />

        </Toolbar>
        <Error
          error={error}
          message={<FormattedMessage id="corrections.messages.error.loading" />}
          actionText={<FormattedMessage id="action.retry" />}
          onAction={loadCorrections}
        >
          <Busy busy={busy}>
            <Empty items={corrections && corrections.data} message={<FormattedMessage id="corrections.messages.empty" />}>
              <List component="nav" aria-label="main categories">
                {corrections && corrections.data.map((c) => (
                  <CorrectionListItem key={c.incorrectText} correction={c} onDeleted={() => updateParams(language, profile)} />
                ))}
              </List>
              {renderPagination()}
            </Empty>
          </Busy>
        </Error>
      </CenteredContent>
    </div>
  );
};

export default CorrectionsListPage;
