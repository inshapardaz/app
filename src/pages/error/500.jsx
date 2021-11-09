import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
// MUI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';

const Error500 = () => (
  <div data-ft="500-page">
    <Container maxWidth="sm" sx={{ mt: (theme) => theme.spacing(8) }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 500,
            height: 400,
          },
        }}
      >
        <Paper elevation={0} sx={{ padding: (theme) => theme.spacing(8) }}>
          <Typography
            variant="h1"
            component="div"
            align="center"
            gutterBottom
            sx={{ color: blueGrey[200], fontSize: '130px', fontWeight: 'bold' }}
          >
            500
          </Typography>
          <Typography
            variant="h4"
            component="div"
            align="center"
            gutterBottom
            sx={{ color: (theme) => theme.palette.grey[700], pb: (theme) => theme.spacing(8) }}
          >
            <FormattedMessage id="error.generic" />

          </Typography>
          <Button component={Link} to="/" variant="text" disableElevation fullWidth size="large">
            <FormattedMessage id="header.home" />
          </Button>
        </Paper>
      </Box>
    </Container>
  </div>
);

export default Error500;
