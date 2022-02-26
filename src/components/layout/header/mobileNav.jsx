import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

import MenuIcon from '@mui/icons-material/Menu';
import { AutoStories, Person, CollectionsBookmark } from '@mui/icons-material';
import NewspaperIcon from '@mui/icons-material/Newspaper';

// Local Import
import ProfileMobileMenu from './profileMobile';
import DarkModeButton from './darkModeButton';
import LanguageSwitcher from '../../language/languageSwitcher';
import LibrarySwitcher from '@/components/library/librarySwitcher';
import CategoriesMobileMenu from '@/components/categories/categoriesMobileMenu';
import PublishingButton from './publishButton';

const MobileNavWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  const toggleDrawer = (o) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpen(o);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <List>
        <ListItem
          button
          key="library"
          component={Link}
          to="/books"
          data-ft="books-link"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ListItemIcon>
            <AutoStories />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="header.books" />} />
        </ListItem>

        <ListItem
          button
          key="authors"
          component={Link}
          to="/authors"
          data-ft="authors-link"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="header.authors" />} />
        </ListItem>

        <ListItem
          button
          key="series"
          component={Link}
          to="/series"
          data-ft="series-link"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ListItemIcon>
            <CollectionsBookmark />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="header.series" />} />
        </ListItem>

        { library && library.supportsPeriodicals
        && (
        <ListItem
          button
          key="periodicals"
          component={Link}
          to="/periodicals"
          data-ft="periodicals-link"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <ListItemIcon>
            <NewspaperIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="header.periodicals" />} />
        </ListItem>
        )}
        <CategoriesMobileMenu onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} />
        <PublishingButton mobile onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} />
        <Divider />
        <ProfileMobileMenu onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} />
      </List>
    </Box>
  );

  return (
    <>
      <MobileNavWrapper>
        <LanguageSwitcher />
        <DarkModeButton asList={false} />
        <LibrarySwitcher />
        <IconButton
          data-ft="mobile-menu"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
      </MobileNavWrapper>
      <Drawer data-ft="mobile-side-bar" anchor="right" open={open} onClose={toggleDrawer(false)}>
        {renderMobileMenu()}
      </Drawer>
    </>
  );
};

export default MobileNav;
