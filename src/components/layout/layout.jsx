import React, { Component } from 'react';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';

const useStyles = () => makeStyles((theme) => ({
	root : {
		padding : theme.spaces(48)
	}
}));
const classes = useStyles();

class Layout extends Component
{
	state = {
		isLoading : false
	};

	render ()
	{
		if (this.state.isLoading)
		{
			return null;
		}

		const { children } = this.props;
		return (
			<>
				<CssBaseline />
				<Header />
					<main className={classes.root}>
						{children}
					</main>
				<Divider />
				<Footer />
			</>
		);
	}
}

export default (connect(
	(state) => ({
	  isLoading : state.isLoading
	}), null)
(Layout));
