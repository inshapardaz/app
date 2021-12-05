import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

// Local Imports
import MobileNav from './mobileNav';
import ProfileMenu from './profile';
import DarkModeButton from './darkModeButton';
import LanguageSwitcher from '@/components/language/languageSwitcher';
import LibrarySwitcher from '@/components/library/librarySwitcher';
import CategoriesMenu from '@/components/categories/categoriesMenu';
import PublishingButton from './publishButton';

const DesktopNavWrapper = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const Nav = () => (
  <>
    <DesktopNavWrapper>
      <Button
        data-ft="books-link"
        aria-label="books"
        color="inherit"
        component={Link}
        to="/books"
        xs={{ margin: (theme) => theme.spacing(1) }}
        startIcon={<AutoStoriesIcon />}
      >
        <FormattedMessage id="header.books" />
      </Button>
      <Button
        data-ft="authors-link"
        aria-label="authors"
        color="inherit"
        component={Link}
        to="/authors"
        xs={{ margin: (theme) => theme.spacing(1) }}
        startIcon={<PersonIcon />}
      >
        <FormattedMessage id="header.authors" />
      </Button>
      <Button
        data-ft="series-link"
        aria-label="series"
        color="inherit"
        component={Link}
        to="/series"
        xs={{ margin: (theme) => theme.spacing(1) }}
        startIcon={<CollectionsBookmarkIcon />}
      >
        <FormattedMessage id="header.series" />
      </Button>
      <CategoriesMenu />
      <PublishingButton />
      <LanguageSwitcher />
      <DarkModeButton />
      <LibrarySwitcher />
      <ProfileMenu />
    </DesktopNavWrapper>
    <MobileNav />
  </>
);

export default Nav;
