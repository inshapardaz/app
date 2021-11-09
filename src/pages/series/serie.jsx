import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

// MUI
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// Local Imports
import { libraryService } from '@/services';
import Busy from '@/components/busy';
import helpers from '@/helpers';
import BookList from '@/components/books/bookList';

// ---------------------------------------------------------------

const SeriePage = () => {
  const intl = useIntl();
  const { seriesId } = useParams();
  const library = useSelector((state) => state.libraryReducer.library);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [series, setSeries] = useState(null);

  useEffect(() => {
    if (seriesId && library) {
      setBusy(true);
      libraryService.getSeriesById(library.id, seriesId)
        .then((res) => setSeries(res))
        .then(() => setBusy(false))
        .catch(() => {
          setBusy(false);
          setError(true);
        });
    }
  }, [seriesId, library]);

  const renderSeries = () => {
    if (series === null) {
      return null;
    }

    return (
      <>
        <Stack direction="row" spacing={2}>
          <img
            src={series.links ? series.links.image : null}
            alt={series.name}
            onError={helpers.setDefaultAuthorImage}
            style={{ height: 240 }}
          />
          <Stack direction="column" spacing={2}>
            <Typography variant="h3" gutterBottom>{series.name}</Typography>
            <Typography variant="subtitle1" gutterBottom><FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} /></Typography>
            <Typography variant="body2" gutterBottom>
              {series.description}
            </Typography>
          </Stack>
        </Stack>
        <BookList library={library} series={series.id} showFilters={false} />
      </>
    );
  };

  return (
    <>
      <Helmet title={series && series.name} />
      <Busy busy={busy} />
      <Container maxWidth="md" sx={{ my: (theme) => theme.spacing(2) }}>
        {renderSeries()}
      </Container>
    </>
  );
};

export default SeriePage;
