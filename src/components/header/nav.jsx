import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import PersonIcon from '@material-ui/icons/Person';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import CategoryIcon from '@material-ui/icons/Category';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root : {
	  display : 'flex'
	},
	button : {
		margin : theme.spacing(1)
	},
	paper : {
	  marginRight : theme.spacing(2)
	}
}));

function Nav (props)
{
	const classes = useStyles();
	const anchorRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);

	const handleToggle = () =>
	{
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) =>
	{
		if (anchorRef.current && anchorRef.current.contains(event.target))
		{
		  return;
		}

		setOpen(false);
	};

	const handleListKeyDown  = (event) =>
	{
		if (event.key === 'Tab')
		{
		  event.preventDefault();
		  setOpen(false);
		}
	};

	const renderCategories = () =>
	{
		console.dir(props.categories);

		if (props.categories && props.categories.items)
		{
			return props.categories.items.map(c => (
				<MenuItem key={c.id} onClick={handleClose} component={Link} to={`/books?category=${c.id}`}>{c.name}</MenuItem>
			));
		}

		return null;
	};

	return (
		<>
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
			<Button
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggle}
				startIcon={<CategoryIcon />}
				endIcon={<KeyboardArrowDownIcon />}
			>
				<FormattedMessage id="header.categories" />
			</Button>
			<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{ transformOrigin : placement === 'bottom' ? 'center top' : 'center bottom' }}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
									{ renderCategories() }
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);

		// return (
		// 	<nav className="mainmenu__nav">
		// 		<ul className="meninmenu d-flex justify-content-start">
		// 			<li>
		// 				<Link to="/"><FormattedMessage id="header.home" /></Link>
		// 			</li>
		// 			<li className="drop">
		// 				<Link to="/books"><FormattedMessage id="header.books" /></Link>
		// 				<div className="megamenu mega03">
		// 					{ this.renderCategories() }
		// 				</div>
		// 			</li>
		// 			<li>
		// 				<Link to="/authors"><FormattedMessage id="header.authors" /></Link>
		// 			</li>
		// 			<li>
		// 				<Link to="/series"><FormattedMessage id="header.series" /></Link>
		// 			</li>
		// 			<li>
		// 				<Link to="/categories"><FormattedMessage id="header.categories" /></Link>
		// 			</li>
		// 		</ul>
		// 	</nav>
		//);
}

export default (connect(
	(state) => ({
		categories : state.apiReducers.categories
	}),
	dispatch => bindActionCreators({
	}, dispatch)
)(Nav));
