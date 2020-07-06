import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import MoreIcon from '@material-ui/icons/MoreVert';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { makeStyles } from '@material-ui/core/styles';
import ProfileMenu from './profileMenu.jsx';
import LanguageSelector from './languageSelector.jsx';
import CategorySelector from './categorySelector.jsx';

const useStyles = makeStyles((theme) => ({
	root : {
	  display : 'flex'
	},
	button : {
		margin : theme.spacing(1)
	},
	paper : {
	  marginRight : theme.spacing(2)
	},
	sectionDesktop : {
		display : 'none',
		[theme.breakpoints.up('md')] : {
			display : 'flex'
		}
	},
	sectionMobile : {
		display : 'flex',
		[theme.breakpoints.up('md')] : {
		  display : 'none'
		}
	}
}));

function Nav ()
{
	const classes = useStyles();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () =>
	{
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) =>
	{
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
		  anchorEl={mobileMoreAnchorEl}
		  anchorOrigin={{ vertical : 'top', horizontal : 'right' }}
		  id={mobileMenuId}
		  keepMounted
		  transformOrigin={{ vertical : 'top', horizontal : 'right' }}
		  open={isMobileMenuOpen}
		  onClose={handleMobileMenuClose}
		>
		  <MenuItem>
				<IconButton aria-label="books" color="inherit"
					component={Link} to="/books">
					<LibraryBooksIcon />
				</IconButton>
				<FormattedMessage id="header.books" />
		  </MenuItem>
		  <MenuItem>
				<IconButton aria-label="authors" color="inherit"
					component={Link} to="/authors">
					<PersonIcon />
				</IconButton>
				<FormattedMessage id="header.authors" />
		  </MenuItem>
		  <MenuItem>
				<IconButton aria-label="series" color="inherit"
					component={Link} to="/series">
					<CollectionsBookmarkIcon />
				</IconButton>
				<FormattedMessage id="header.series" />
		  </MenuItem>
		  <CategorySelector />
		  <LanguageSelector />
		  <ProfileMenu />
		</Menu>
	  );

	return (
		<>
			<div className={classes.sectionDesktop}>
				<Button aria-label="books"
					color="inherit"
					component={Link} to="/books"
					className={classes.button}
					startIcon={<LibraryBooksIcon />}
				>
					<FormattedMessage id="header.books" />
				</Button>
				<Button aria-label="authors"
					color="inherit"
					component={Link} to="/authors"
					className={classes.button}
					startIcon={<PersonIcon />}
				>
					<FormattedMessage id="header.authors" />
				</Button>
				<Button aria-label="series"
					color="inherit"
					component={Link} to="/series"
					className={classes.button}
					startIcon={<CollectionsBookmarkIcon />}
				>
					<FormattedMessage id="header.series" />
				</Button>
				<CategorySelector />
				<LanguageSelector />
				<ProfileMenu />
			</div>
			<div className={classes.sectionMobile}>
				<IconButton
					aria-label="show more"
					aria-controls={mobileMenuId}
					aria-haspopup="true"
					onClick={handleMobileMenuOpen}
					color="inherit"
				>
					<MoreIcon />
				</IconButton>
			</div>
			{renderMobileMenu}
		</>
	);
}

export default Nav;
