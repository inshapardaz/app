import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';

// MUI
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

// Local imports
import PublicationSummary from '@/components/account/publicationSummary';
import BookStatusList from '@/components/books/booksStatusList';
import BookStatus from '@/models/bookStatus';

const PublishingPage = () => {
  const intl = useIntl();
  return (
    <>
      <Helmet title={intl.formatMessage({ id: 'header.publishing' })} />
      <Grid container sx={{ mt: (theme) => theme.spacing(2) }}>
        <Grid item md={3}>
          <Stack
            spacing={2}
            mt={4}
            justifyContent="center"
            alignItems="center"
          >
            <PublicationSummary />
          </Stack>
        </Grid>
        <Grid item md={9}>
          <Stack spacing={2} sx={{ mt: (theme) => theme.spacing(4) }}>
            <BookStatusList bookStatus={BookStatus.BeingTyped} />
            <BookStatusList bookStatus={BookStatus.ProofRead} />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default PublishingPage;
