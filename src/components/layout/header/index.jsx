import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Local Imports
import Nav from './nav';
import SearchBox from './searchBox';

const Library = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const Logo = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Header = () => {
  const selectedLibrary = null;
  // const classes = useStyles();
  // let selectedLibrary = libraryService.getSelectedLibrary();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link to="/">
          <Logo data-ft="logo" height="24" width="24" src="/images/logo.png" style={{ margin: '4px' }} />
        </Link>
        <Library data-ft="app-name">
          <Typography variant="h6" color="inherit" noWrap>
            {selectedLibrary != null ? selectedLibrary.name : <FormattedMessage id="app" />}
          </Typography>
        </Library>
        <SearchBox />
        <Box sx={{ flexGrow: 1 }} />
        <Nav />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
