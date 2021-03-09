import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import MoreIcon from '@material-ui/icons/MoreVert';
import CreateIcon from '@material-ui/icons/Create';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { makeStyles } from '@material-ui/core/styles';
import ProfileMenu from './profileMenu.jsx';
import LanguageSelector from './languageSelector.jsx';
import CategorySelector from './categorySelector.jsx';
import LibrarySelector from './librarySelector.jsx';
import { libraryService } from '../../services';
import { orange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	button: {
		margin: theme.spacing(1)
	},
	paper: {
		marginRight: theme.spacing(2)
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
		}
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	publishButton: {
		color: theme.palette.getContrastText(orange[500]),
		backgroundColor: orange[500],
		'&:hover': {
			backgroundColor: orange[700],
		}
	}
}));

function Nav() {
	const classes = useStyles();
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const renderPublishingButton = (isMobile = false) => {
		const selectedLibrary = libraryService.getSelectedLibrary();

		if (selectedLibrary && selectedLibrary.links.create_book) {
			if (isMobile) {
				return (<MenuItem>
					<IconButton aria-label="publishing" color="inherit"
						component={Link} to="/publishing">
						<CreateIcon />
					</IconButton>
					<FormattedMessage id="header.publishing" />
				</MenuItem>);
			}
			else {
				return (<Button aria-label="publishing"
					color="primary"
					component={Link} to="/publishing"
					className={classes.publishButton}
					startIcon={<CreateIcon />}
				>
					<FormattedMessage id="header.publishing" />
				</Button>);
			}
		}

		return null;
	};

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
			{renderPublishingButton(true)}
			<CategorySelector />
			<LanguageSelector />
			<LibrarySelector />
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
				{renderPublishingButton()}
				<LanguageSelector />
				<LibrarySelector />
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
