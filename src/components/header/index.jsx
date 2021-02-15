import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Nav from './nav.jsx';
import { libraryService } from '../../services/index.js';
import SearchBox from './searchBox.jsx';

const useStyles = makeStyles((theme) => ({
	icon: {
		marginRight: theme.spacing(2)
	},
	grow: {
		flexGrow: 1
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
		}
	}
}));

export default function Header() {
	const classes = useStyles();
	let selectedLibrary = libraryService.getSelectedLibrary();

	return (<AppBar position="sticky">
		<Toolbar>
			<Link to="/">
				<img className={classes.icon} height="24" width="24" src="/images/logo.png" style={{ margin: '4px' }} />
			</Link>
			<div className={classes.sectionDesktop} >
				<Typography variant="h6" color="inherit" noWrap>
					{selectedLibrary != null ? selectedLibrary.name : <FormattedMessage id="app" />}
				</Typography>
			</div>
			<SearchBox />
			<div className={classes.grow} />
			<Nav />
		</Toolbar>
	</AppBar>);
}
