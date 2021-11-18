import React from 'react';
import { useSelector } from 'react-redux';

// MUI
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// Local Import
import { FormattedMessage } from 'react-intl';
import LibrariesCell from '@/components/library/libraryCell';
import PageHeader from '@/components/pageHeader';

const UserLibrariesPage = () => {
  const entry = useSelector((state) => state.libraryReducer.entry);
  return (
    <>
      <PageHeader title={<FormattedMessage id="library.select" />} />
      <Container data-ft="user-libraries-page">
        <Grid container spacing={3}>
          {entry && entry.data.map((l) => (
            <Grid item key={l.id} xs={12} sm={6} md={4} alignItems="stretch">
              <LibrariesCell library={l} key={l.id} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default UserLibrariesPage;
