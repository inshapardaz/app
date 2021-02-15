import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from "react-router-dom";
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	}
}));

const SearchBox = () => {
	const classes = useStyles();
	const intl = useIntl();
	const history = useHistory();
	const [query, setQuery] = useState('');


	const onSearch = () => {
		if (query && query.trim() !== '') {
			history.push(`/search?q=${query.trim()}`);
		}
	}

	const keyPress = (e) => {
		if (e.keyCode == 13) {
			onSearch();
		}
	}

	return (<div className={classes.search}>
		<InputBase
			placeholder={intl.formatMessage({ id: "header.search" })}
			classes={{
				root: classes.inputRoot,
				input: classes.inputInput,
			}}
			onChange={(event) => setQuery(event.target.value)}
			onKeyDown={keyPress}
			inputProps={{ 'aria-label': 'search' }}
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						aria-label="search"
						onClick={onSearch}
						onMouseDown={onSearch}
					>
						<SearchIcon />
					</IconButton>
				</InputAdornment>
			}
		/>
	</div>);
}

export default SearchBox;
