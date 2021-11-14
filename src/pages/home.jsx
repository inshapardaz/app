import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// MUI
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box, Button, Container, Divider, IconButton, InputBase, Paper, Typography,
} from '@mui/material';

// Local Import
import LatestBooks from '@/components/books/latestBooks';

const useStaticImage = localStorage.getItem('useStaticImage') === 'true' || false;

const HomePage = () => {
  const intl = useIntl();
  const library = useSelector((state) => state.libraryReducer.library);

  if (library == null) return null;

  return (
    <>
      <Helmet title={library.name} />
      <Box
        sx={{
          backgroundImage: (useStaticImage ? 'url(/images/home_background.jpg)' : 'url(https://source.unsplash.com/1600x900/?library,books)'),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '613px',
          display: 'grid',
        }}
        data-ft="home-page"
      >
        <Box sx={{
          padding: '68px 0 28px 0',
          textAlign: 'center',
          backgroundColor: (theme) => alpha(theme.palette.primary.contrastText, 0.6),
        }}
        >
          <Container maxWidth="sm">
            <Typography variant="h3" align="center" gutterBottom>{library.name}</Typography>
            <Typography variant="h2" align="center" gutterBottom>{library.slogan}</Typography>
            <Typography variant="body1" align="center" gutterBottom><FormattedMessage id="home.message" /></Typography>
            <Button
              variant="contained"
              align="center"
              color="primary"
              size="large"
              fullWidth
              sx={{ my: '16px' }}
              component={Link}
              to="/books"
            >
              <FormattedMessage id="home.getStarted" />
            </Button>

            <Paper component="form" align="center" sx={{ marginTop: '50px', marginBottom: '16px', display: 'flex' }}>
              <InputBase
                sx={{ marginLeft: (theme) => theme.spacing(1), flex: 1 }}
                placeholder={intl.formatMessage({ id: 'header.search.placeholder' })}
                inputProps={{ 'aria-label': 'search' }}
              />
              <Divider sx={{ height: '28px', margin: '4px' }} orientation="vertical" />
              <IconButton type="submit" sx={{ padding: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Container>
        </Box>
      </Box>
      <Box sx={{ padding: '28px 0' }}>
        <Typography variant="h3" align="center" gutterBottom>
          <FormattedMessage id="home.latestBooks" />
        </Typography>
        <LatestBooks />
      </Box>
    </>
  );
};

export default HomePage;
